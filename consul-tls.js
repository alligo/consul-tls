#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('1.0.0')
  .option('-g, --get', 'Get Value (default)', 1)
  .option('-s, --set', 'Set value')
  .option('-u, --url', 'Consul Host', 'http://localhost:8500')
  .option('--fqdn', 'FQDN of key certificate, without last dot (e.g. mydomain.com)')
  .option('-c, --cert', 'Path to certificate (e.g. ./folder/mydomain.crt)')
  .option('-k, --key', 'Path to certificate Key (e.g. ./folder/mydomain.key)')
  //.option('-P, --pineapple', 'Add pineapple')
  //.option('-b, --bbq-sauce', 'Add bbq sauce')
  //.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('debug:');
if (program.get) console.log('  - get');
if (program.set) console.log('  - set');
if (program.url) console.log('  - url');
if (program.fqdn) console.log('  - fqdn');
if (program.cert) console.log('  - cert');
if (program.key) console.log('  - certkey');
console.log('  - %s get', program.get);
console.log('  - %s set', program.set);