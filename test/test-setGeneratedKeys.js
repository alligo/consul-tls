'use strict';

var expect = require('chai').expect;
var consulTls = require('../lib/consul-tls');

describe('setGeneratedKeys', function() {
	it('setGeneratedKeys function should exist', () => {
		expect(consulTls).to.have.property('setGeneratedKeys').with.is.a('function');
	});
});
