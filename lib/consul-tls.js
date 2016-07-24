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
        //console.log(body);

        console.log('getConsulKVItem');
        console.log('before ', body);

        value = new Buffer(JSON.parse(body)[0].Value, 'base64').toString();
        console.log('after ', value);

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
  getFileBase64: function (path) {
    var contents = fs.readFileSync(path, 'utf8');
    //console.log(contents);
    if (contents) {
      //return new Buffer(contents).toString('base64');
      return contents;
    } else {
      throw "Unable to read files. [" + path + "]";
      return false;
    }
  },
  /**
   * 
   * @see http://stackoverflow.com/questions/14573001/nodejs-how-to-decode-base64-encoded-string-back-to-binary
   * @see https://nodejs.org/dist/v6.0.0/docs/api/buffer.html#buffer_new_buffer_str_encoding
   * 
   * @param   {String}     path  Path to save
   * @param   {String}     data  Base64 encoded data
   * @trow    {Execption}
   * @returns {undefined}
   */
  saveFileBase64: function (path, data) {

    //console.log('saveFileBase64');
    //console.log(data);
    //console.log((new Buffer(data, 'base64').toString('utf8')));
    //fs.writeFileSync(path, (new Buffer(data, 'base64').toString('utf8')), 'utf-8');
    fs.writeFileSync(path, data, 'utf-8');

  },
  /**
   * Batch set. Not working. IDK why
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
    //DEBUG && console.log(JSON.stringify(data));
    request.put(
            consul + '/v1/txn',
            {form: JSON.stringify(data)},
            function (error, response, body) {
              if (!error && response.statusCode === 200) {
                console.log(body);
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
        console.log(body);
        cb(null);
      } else {
        cb({error: response.statusCode, message: error});
      }
    });
  }
};

/**
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
    certData = consulTls.getFileBase64(cert);
    //console.log('certData', certData);
    keyData = consulTls.getFileBase64(key);
    //console.log('keyData', keyData);
  } catch (e) {
    console.log(e);
  }

  consulTls.setConsulKVItem(cb, consul, fdqn + '.crt', certData);
  consulTls.setConsulKVItem(cb, consul, fdqn + '.key', keyData);
};

/**
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
      //console.log('aaaa', JSON.parse(data1)[0].Value)
      //consulTls.saveFileBase64(cert, JSON.parse(data1)[0].Value);
      consulTls.saveFileBase64(cert, data1);

      consulTls.getConsulKVItem(function (err2, data2) {
        if (!err2) {
          !!DEBUG && console.log('executeRestore: get consul key ok');
          //consulTls.saveFileBase64(key, JSON.parse(data2)[0].Value);
          consulTls.saveFileBase64(key, data2);
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