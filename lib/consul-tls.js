/**
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */
var fs = require('fs'), request = require('request');;

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

  },
  setConsulKV: function (cb, consul, data) {
    console.log(consul + '/v1/txn');
    console.log(JSON.stringify(data));
    request.put(
    consul + '/v1/txn',
    { form: JSON.stringify(data) },
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            cb(null);
        } else {
          cb({error: response.statusCode, message: error});
        }
    }
);
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
  consulTls.setConsulKV(cb, consul, [
    {
      "KV": {
        "Verb": "set",
        "Key": cert,
        "Value": certData
      }
    },
    {
      "KV": {
        "Verb": "set",
        "Key": key,
        "Value": keyData
      }
    }
  ]);
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