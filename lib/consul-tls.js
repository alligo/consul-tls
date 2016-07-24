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
  getConsulKVItem: function (cb, path) {
    !!DEBUG && console.log('DEBUG: setConsulKVItem: ' + consul + '/v1/kv/certs/' + key);

    var options = {
      method: "GET",
      url: consul + '/v1/kv/certs/' + key,
      form: value
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
        cb(null, body);
      } else {
        cb({error: response.statusCode, message: error}, null);
      }
    });
  },
  getFileBase64: function (path) {
    var contents = fs.readFileSync(path, 'utf8');
    //console.log(contents);
    if (contents) {
      return new Buffer(contents).toString('base64');
    } else {
      throw "Unable to read files. [" + path + "]";
    }
  },
  saveFileBase64: function (path) {
    //console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('utf8'))
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
  try {
    certData = consulTls.getConsulKVItem(console.log, consul, fdqn + '.crt');
    !!DEBUG && console.log('certData', certData);
    keyData = consulTls.getConsulKVItem(console.log, consul, fdqn + '.key');
    !!DEBUG && console.log('keyData', keyData);
  } catch (e) {
    console.log(e);
  }
};

module.exports.init = function (options) {
  DEBUG = options.debug;
};