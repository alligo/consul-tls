'use strict';

var expect = require('chai').expect;
var consulTls = require('../lib/consul-tls');

describe('init', function() {
	it('init function should exist', () => {
		expect(consulTls).to.have.property('init').with.is.a('function');
	});
});
