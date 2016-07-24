/**
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */
var fs = require('fs'), request = require('request');
var DEBUG = false, OPTIONS = {
  debug: 'false'
};

var consulTls = {
  /**
   * @deprecated not used. See {setConsulKV}
   * @returns {undefined}
   */
  getConsulKV: function () {

  },
  /**
   * For a path, return original value
   *
   * Note: base path is /v1/kv/certs/
   *
   * @param   {Function}  cb
   * @param   {String}    consul  
   * @param   {String}    path 
   * @returns {Callback}  error, value
   */
  getConsulKVItem: function (cb, consul, path) {
    var value;
    !!DEBUG && console.log('DEBUG: setConsulKVItem: ' + consul + '/v1/kv/certs/' + path);

    request(consul + '/v1/kv/certs/' + path, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        value = new Buffer(JSON.parse(body)[0].Value, 'base64').toString();

        cb(null, value);

      } else {
        cb({error: response.statusCode, message: error}, null);
      }
    });
  },
  /**
   * Syncronous read a file and return contents base64 encoded
   *
   * @param   {String}  path  Path to the file
   * @returns {String}
   */
  getFile: function (path) {
    var contents = fs.readFileSync(path, 'utf8');
    if (contents) {
      return contents;
    } else {
      throw "Unable to read files. [" + path + "]";
      return false;
    }
  },
  /**
   * Sincronous write to the disk
   *
   * @see http://stackoverflow.com/questions/14573001/nodejs-how-to-decode-base64-encoded-string-back-to-binary
   * @see https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_new_buffer_str_encoding
   * 
   * @param   {String}     path  Path to save
   * @param   {String}     data  Base64 encoded data
   * @trow    {Execption}
   * @returns {undefined}
   */
  saveFile: function (path, data) {
    fs.writeFileSync(path, data, 'utf-8');

  },
  /**
   * Batch set. Not working. Not used for now
   * 
   * @example
   *  consulTls.setConsulKV(cb, consul, [
   *    {
   *      "KV": {
   *        "Verb": "set",
   *        "Key": cert,
   *        "Value": certData
   *      }
   *    },
   *    {
   *      "KV": {
   *        "Verb": "set",
   *        "Key": key,
   *        "Value": keyData
   *      }
   *    }
   *  ]);
   *
   * @param   {String}   cb
   * @param   {String}   consul
   * @param   {String}   data
   * @returns {Callback}
   */
  setConsulKV: function (cb, consul, data) {
    !!DEBUG && console.log(consul + '/v1/txn');
    request.put(
            consul + '/v1/txn',
            {form: JSON.stringify(data)},
            function (error, response, body) {
              if (!error && response.statusCode === 200) {
                //console.log(body);
                cb(null);
              } else {
                cb({error: response.statusCode, message: error});
              }
            }
    );
  },
  /**
   * Set a value to a key on certs/ subpath
   *
   * @param   {Function}  cb
   * @param   {String}    consul
   * @param   {String}    key
   * @param   {String}    value
   * @returns {Callback}
   */
  setConsulKVItem: function (cb, consul, key, value) {
    !!DEBUG && console.log('DEBUG: setConsulKVItem: ' + consul + '/v1/kv/certs/' + key);
    //console.log('aaaaa', DEBUG);
    var options = {
      method: "PUT",
      url: consul + '/v1/kv/certs/' + key,
      form: value
    };
    request.put(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //console.log(body);
        cb(null);
      } else {
        cb({error: response.statusCode, message: error});
      }
    });
  }
};

/**
 * Save Cert and key to consul KV
 *
 * @param   {Function} cb      Callback function
 * @param   {String}   consul  Consul Host
 * @param   {String}   fdqn    FQDN of key certificate
 * @param   {String}   cert    Path to certificate
 * @param   {String}   key     Path to certificate
 * @returns {Callback}
 */
module.exports.executeSave = function (cb, consul, fdqn, cert, key) {
  var certData, keyData;
  try {
    certData = consulTls.getFile(cert);
    keyData = consulTls.getFile(key);
  } catch (e) {
    console.log(e);
  }
  if (!!certData && !!keyData) {
    consulTls.setConsulKVItem(function () {
      consulTls.setConsulKVItem(cb, consul, fdqn + '.key', keyData);
    }, consul, fdqn + '.crt', certData);
  }
};

/**
 * Access Consul KV and save cert and key to disk
 *
 * @param   {Function} cb      Callback function
 * @param   {String}   consul  Consul Host
 * @param   {String}   fdqn    FQDN of key certificate
 * @param   {String}   cert    Path to certificate
 * @param   {String}   key     Path to certificate
 * @returns {Callback}
 */
module.exports.executeRestore = function (cb, consul, fdqn, cert, key) {
  var certData, keyData;

  consulTls.getConsulKVItem(function (err, data1) {
    if (!err) {
      !!DEBUG && console.log('executeRestore: get consul cert ok');
      consulTls.saveFile(cert, data1);

      consulTls.getConsulKVItem(function (err2, data2) {
        if (!err2) {
          !!DEBUG && console.log('executeRestore: get consul key ok');
          consulTls.saveFile(key, data2);
        } else {
          console.log('ERROR: executeRestore failed to get', consul, fdqn + '.key');
        }
      }, consul, fdqn + '.key');
    } else {
      console.log('ERROR: executeRestore failed to get', consul, fdqn + '.crt');
    }
  }, consul, fdqn + '.crt');
};

module.exports.init = function (options) {
  DEBUG = options.debug;
};