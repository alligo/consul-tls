'use strict';

const fs = require('fs');
const got = require('got');

const consulAPI = {

	consulUrl: '',
	certKeys: {},
	params: {},

	checkParams(paramsObj) {
		if(
			!paramsObj.operation &&
			!paramsObj.consulUrl &&
			!paramsObj.fqdn &&
			!paramsObj.cert &&
			!paramsObj.certSecret
		) {
			throw new Error('Need to send all params');
		}

		if(paramsObj.operation !== 'set' && paramsObj.operation !== 'get') {
			throw new Error('The first parameter need to be the operation. This parameter accept "set" ot "get" as value');
		}

		if(!consulAPI.checkIfFileExist(paramsObj.cert) && paramsObj.operation == 'set') {
			throw new Error('File sent as certificate doesn\'t exist');
		}

		if(!consulAPI.checkIfFileExist(paramsObj.certSecret)  && paramsObj.operation == 'set') {
			throw new Error('File sent as key certificate doesn\'t exist');
		}

		return Promise.resolve(paramsObj);
	},

	checkIfFileExist(path) {
		try {
			fs.accessSync(path, fs.R_OK | fs.W_OK);
		} catch(e) {
			return false;
		}

		return true;
	},

	init(paramsObj) {
		consulAPI.consulUrl = `${paramsObj.consulUrl}/v1/kv`;
		consulAPI.params = paramsObj;

		return consulAPI
			.setGeneratedKeys()
			.then(() => {
				if(paramsObj.operation === 'set') {
					return consulAPI.setConsul();
				}

				if(paramsObj.operation === 'get') {
					return consulAPI.getConsul();
				}

				return true;
			});
	},

	setGeneratedKeys() {
		consulAPI.certKeys = {
			cert: consulAPI.buildKeyString('cert'),
			secret: consulAPI.buildKeyString('key')
		};

		return Promise.resolve(true);
	},

	buildKeyString(type) {
		let fqdn = `${type}.${consulAPI.params.fqdn}.tls`;
		return fqdn.split('.').reverse().join('/');;
	},

	setConsul() {
		let certFile = fs.readFileSync(consulAPI.params.cert).toString();
		let secretFile = fs.readFileSync(consulAPI.params.certSecret).toString();

		return Promise.all([
			consulAPI.createFile('cert', certFile),
			consulAPI.createFile('secret', secretFile)
		]);
	},

	createFile(type, certFile) {
		return got(`${consulAPI.consulUrl}/${consulAPI.certKeys[type]}`, {
			method: 'PUT',
			body: certFile
		}).then((consulResult) => {
			if(consulResult.body === 'true') {
				return consulAPI.getModifiedIndex(type);
			}

			if(consulResult.body === 'false') {
				return Promise.reject('Request Error');
			}
		});
	},

	getModifiedIndex(type) {
		return got(`${consulAPI.consulUrl}/${consulAPI.certKeys[type]}`, {
			method: 'GET',
			json: true
		}).then((consulResult) => {
			if(!consulResult.body[0].ModifyIndex) {
				return Promise.reject('Erro trying to get ModifyIndex');
			}

			let fileName = consulAPI.params.cert;
			if(type === 'secret') {
				fileName = consulAPI.params.certSecret;
			}

      fs.writeFileSync(`${fileName}.ModifyIndex`, consulResult.body[0].ModifyIndex + '');

			return true;
		});
	},

	getConsul() {
		return Promise.all([
			consulAPI.getConsulCert('cert'),
			consulAPI.getConsulCert('secret')
		]);
	},

	getConsulCert(type) {
		return got(`${consulAPI.consulUrl}/${consulAPI.certKeys[type]}`, {
			method: 'GET',
			json: true
		}).then((consulResult) => {
			if(!consulResult.body[0].Value) {
				return Promise.reject('Erro trying to get Value');
			}

			let fileName = consulAPI.params.cert;
			if(type === 'secret') {
				fileName = consulAPI.params.certSecret;
			}

			let consulCert = new Buffer(consulResult.body[0].Value, 'base64').toString();
			let modifiedFile = fs.createWriteStream(`${fileName}`);
			modifiedFile.write(new Buffer(consulCert, 'binary'));
			modifiedFile.end();

			return consulAPI.getModifiedIndex(type);;
		});
	}

};

module.exports = Object.create(consulAPI);
