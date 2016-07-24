#!/usr/bin/env node

var exec = require('child_process').exec, fs = require('fs');

var cmd = './index.js --set --url http://localhost:8500 --fqdn=localhost --cert ./test/localhost.crt --key ./test/localhost.key';
console.log('================================================================================');
console.log('TEST: set');

console.log(cmd);
exec(cmd, function (error, stdout, stderr) {
  if (error) {
    console.log('error', error);
  }
  if (stderr) {
    console.log('stderr', stderr);
  }
  console.log(stdout);

  var cmd = './index.js --debug --get --url http://localhost:8500 --fqdn=localhost --cert ./test/result-localhost.crt --key ./test/result-localhost.key';
  console.log('================================================================================');
  console.log('TEST: get');

  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log('error', error);
    }
    if (stderr) {
      console.log('stderr', stderr);
    }
    console.log(stdout);

    (function () {
      if (fs.readFileSync('./test/localhost.crt', 'utf8') === fs.readFileSync('./test/result-localhost.crt', 'utf8')) {
        console.log('Cert files OK');
      } else {
        console.log('Cert files ERROR, not equal');
      }
      if (fs.readFileSync('./test/localhost.key', 'utf8') === fs.readFileSync('./test/result-localhost.key', 'utf8')) {
        console.log('Key files OK');
      } else {
        console.log('Key files ERROR, not equal');
      }
    })();
  });
});

