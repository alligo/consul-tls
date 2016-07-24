/**
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */
var fs = require('fs');

module.exports = {
  getConsulKV: function () {

  },
  getFileBase64: function (path) {
    var contents = fs.readFileSync('DATA', 'utf8');
    console.log(contents);
  },
  init: function () {

  },
  saveFileBase64: function (path) {

  },
  setConsulKV: function () {

  }
};

module.exports.executeSave = function (cb) {

};
module.exports.executeRestore = function () {

};

