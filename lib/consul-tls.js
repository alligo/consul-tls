/**
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */
var fs = require('fs'), request = require('request');
;

var consulTls = {
  getConsulKV: function () {

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
   * @param {type} cb
   * @param {type} consul
   * @param {type} data
   * @returns {undefined}
   */
  setConsulKV: function (cb, consul, data) {
    console.log(consul + '/v1/txn');
    console.log(JSON.stringify(data));
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
    console.log(consul + '/v1/kv/certs/' + key);
    //console.log(JSON.stringify(data));
//    request.put(
//            consul + '/v1/kv/certs/' + key,
//            {form: value},
//            function (error, response, body) {
//              if (!error && response.statusCode === 200) {
//                console.log(body);
//                cb(null);
//              } else {
//                cb({error: response.statusCode, message: error});
//              }
//            }
//    );
    var options = {
      method: "PUT",
      //host: consul,
//      host: 'localhost:8500',
//      path: '/v1/kv/certs/' + key,
      url: consul + '/v1/kv/certs/' + key,
      form: value
    };

//    request({
//      method: "PUT",
//      //host: consul,
//      host: 'localhost:8500',
//      path: '/v1/kv/certs/' + key,
//      body: value
//    }, cb);
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
//  consulTls.setConsulKV(cb, consul, [
//    {
//      "KV": {
//        "Verb": "set",
//        "Key": cert,
//        "Value": certData
//      }
//    },
//    {
//      "KV": {
//        "Verb": "set",
//        "Key": key,
//        "Value": keyData
//      }
//    }
//  ]);
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

};

//module.exports.init = function() {
//  
//};