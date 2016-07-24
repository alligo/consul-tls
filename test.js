#!/usr/bin/env node


var exec = require('child_process').exec;

var cmd = './index.js --set aaaa --get bbb';
var cmd = './index.js --set --url http://localhost:8500 --fqdn=localhost --cert ./test/localhost.crt --key ./test/localhost.key';

console.log(cmd);
exec(cmd, function(error, stdout, stderr) {
  if (error) {
    console.log('error', error);
  }
  if (stderr) {
    console.log('stderr', stderr);
  }
  console.log(stdout);
});