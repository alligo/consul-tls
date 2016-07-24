#!/usr/bin/env node
/**
 * @todo Finish tests with mocha and remove actual test.js
 */

var exec = require('child_process').exec;
var assert = require('chai').assert;

describe('Store and Restore TLS cert and keys from Consul KV', function () {

  var cmd = './index.js --set --url http://localhost:8500 --fqdn=localhost --cert ./test/localhost.crt --key ./test/localhost.key';
  //console.log('================================================================================');
  //console.log('TEST: set');
  //console.log(cmd);

  it('should save on consul KV', function () {
    exec(cmd, function (error, stdout, stderr) {
      if (error) {
        console.log('error', error);
      }
      if (stderr) {
        console.log('stderr', stderr);
      }
      assert(!!error);
      done();

      console.log(stdout);
    });
  });
  
  it('should restore from consul KV to disk', function () {
    var cmd = './index.js --debug --get --url http://localhost:8500 --fqdn=localhost --cert ./test/result-localhost.crt --key ./test/result-localhost.key';
    //console.log('================================================================================');
    //console.log('TEST: get');

    exec(cmd, function (error, stdout, stderr) {
      if (error) {
        console.log('error', error);
      }
      if (stderr) {
        console.log('stderr', stderr);
      }
      assert(!!error);
      console.log(stdout);

      done();
    });
  });
  
  it('files should be equal', function () {
    
  });
});

