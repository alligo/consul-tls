#!/usr/bin/env node


var exec = require('child_process').exec;

var cmd = './index.js --set aaaa --get bbb';

exec(cmd, function(error, stdout, stderr) {
  if (error) {
    console.log('error', error);
  }
  if (stderr) {
    console.log('stderr', stderr);
  }
  console.log(stdout);
});