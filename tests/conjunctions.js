'use strict';

var chai = require('chai');
var expect = chai.expect;

var Conjunctions = require('../src/conjunctions.js').Conjunctions;
var conjunctions = new Conjunctions();

describe('Conjunctions', function() {
	it('Conjunctions.create should throw error if type is unknown', function() {
		var def = {
			"type": "unknown"
		};
		expect(function() {conjunctions.create(def);}).to.throw(Error);
	});

	it('Conjunctions.condition should throw error if lhs/rhs/op attributes are missing or of unknown type', function() {
		var def = {
			"type": "condition",
			"lhs": {
				"type": "element_value",
				"element": "status"
			},
			"rhs": {
				"type" : "const",
				"value" : "CANCELLED"
			}
		};
		expect(function(){conjunctions.create(def);}).to.throw(Error, /Missing op attribute in/);
		def.op = "eq";
		def.lhs = undefined;
		expect(function(){conjunctions.create(def);}).to.throw(Error, /Missing lhs attribute in/);
		def.lhs = {
			"type": "element_value",
			"element": "status"
		};
		def.rhs = undefined;
		expect(function(){conjunctions.create(def);}).to.throw(Error, /Missing rhs attribute in/);
		def.rhs = {
			"type" : "const",
			"value" : "CANCELLED"
		};
		def.op = "junk";
		expect(function(){conjunctions.create(def);}).to.throw(Error, /Unknown operator/);
	});

	it('Conjunctions.condition should return a function that returns true/false based on specified simple condition def', function() {
		var def = {
			"type": "condition",
			"lhs": {
				"type" : "const",
				"value" : 10			
			},
			"op": "ge",
			"rhs": {
				"type" : "const",
				"value" : 100
			}
		};		
		var condition = conjunctions.create(def);
		var answers = {};
		expect(condition(answers)).to.be.false;
		def.op = "lt";
		condition = conjunctions.create(def);
		expect(condition(answers)).to.be.true;		
	});

	it('Conjunctions.condition should return a function that returns true/false based on specified element value condition def', function() {
		var def = {
			"type": "condition",
			"lhs": {
				"type": "element_value",
				"element": "status"
			},
			"op": "eq",
			"rhs": {
				"type" : "const",
				"value" : "CANCELLED"
			}
		};		
		var condition = conjunctions.create(def);
		var answers = {
			"status" : "CANCELLED"
		};
		expect(condition(answers)).to.be.true;
		answers.status = "NEW";
		expect(condition(answers)).to.be.false;
	});	
});