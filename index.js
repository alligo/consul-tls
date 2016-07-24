#!/usr/bin/env node

/**
 * Main file. Run with command `node index.js` or similar
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var program = require('commander');
var consulTls = require('./lib/consul-tls');

program
        .version('1.0.0')
        .option('-g, --get', 'Get Value (default)', 1)
        .option('-s, --set', 'Set value')
        .option('-u, --url', 'Consul Host', 'http://localhost:8500')
        .option('-f, --fqdn [value]', 'FQDN of key certificate, without last dot e.g. mydomain.com')
        .option('-c, --cert [value]', 'Path to certificate (e.g. ./folder/mydomain.crt)')
        .option('-k, --key [value]', 'Path to certificate Key (e.g. ./folder/mydomain.key)')
        .option('-v, --debug', 'Enable verbose / debug')
        //.option('-P, --pineapple', 'Add pineapple')
        //.option('-b, --bbq-sauce', 'Add bbq sauce')
        //.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
        .parse(process.argv);

if (program.debug) {
  consulTls.init({debug: true});
}

if (program.set) {
  consulTls.executeSave(function (err, result) {
    if (err) {
      console.log('ERROR:', err);
      return 1;
    }
    return 0;
  }, program.url, program.fqdn, program.cert, program.key);
} else if (program.get) {
  consulTls.executeRestore(function (err, result) {
    if (err) {
      console.log('ERROR:', err);
      return 1;
    }
    return 0;
  }, program.url, program.fqdn, program.cert, program.key);
}
