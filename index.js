#!/usr/bin/env node

/**
 * Main file. Run with command `node index.js` or similar
 *
 * @package       consul-tls
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
*/

'use strict';

const consulTls = require('./lib/consul-tls');

if(process.argv.length !== 7) {
	throw new Error('Need to send all params');
}

let operation = process.argv[2];
let consulUrl = process.argv[3];
let fqdn = process.argv[4];
let cert = process.argv[5];
let certSecret = process.argv[6];

consulTls
	.checkParams({ operation, consulUrl, fqdn, cert, certSecret })
	.then(consulTls.init)
	.catch((moduleError) => {
		console.log((moduleError || 'Unknown Error'));
		process.exit(1);
	})
	.then(() => {
		process.exit(0);
	});
