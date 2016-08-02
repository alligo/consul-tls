'use strict';

var expect = require('chai').expect;
var consulTls = require('../lib/consul-tls');

describe('checkParams', function() {
	it('checkParams function should exist', () => {
		expect(consulTls).to.have.property('checkParams').with.is.a('function');
	});
});
