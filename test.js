#!/usr/bin/env node


var exec = require('child_process').exec;

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
  });
});

