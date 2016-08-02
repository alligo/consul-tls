'use strict';

var expect = require('chai').expect;
var consulTls = require('../lib/consul-tls');

describe('buildKeyString', function() {
	it('buildKeyString function should exist', () => {
		expect(consulTls).to.have.property('buildKeyString').with.is.a('function');
	});

	it('buildKeyString should create string for cert', () => {
		expect(consulTls.buildKeyString('homolog.zimp.me', 'cert')).to.be.a('string').and.equal('tls/me/zimp/homolog/cert');
		expect(consulTls.buildKeyString('post.doctor.homolog.zimp.me', 'cert')).to.be.a('string').and.equal('tls/me/zimp/homolog/doctor/post/cert');
	});

	it('buildKeyString should create string for key', () => {
		expect(consulTls.buildKeyString('homolog.zimp.me', 'key')).to.be.a('string').and.equal('tls/me/zimp/homolog/key');
		expect(consulTls.buildKeyString('post.doctor.homolog.zimp.me', 'key')).to.be.a('string').and.equal('tls/me/zimp/homolog/doctor/post/key');
	});
});
