'use strict';

var chai = require('chai');
var expect = chai.expect;

var Validations = require('../src/validations.js').Validations;
var validations = new Validations();

describe('Validations', function() {
	it('Validations.create should throw error if unknown type is specified', function() {
		var def = {
			"type": "unknown" 
		};
		expect(function() {validations.create(def);}).to.throw(Error);
	});

	it('Validations.number should return a function that returns true for number and error message for non-number value', function() {
		var def = {
			"type": "number" 
		};
		var numberValidation = validations.create(def);
		expect(numberValidation(1)).to.be.true;
		expect(typeof numberValidation("asgd")).to.equal('string');
	});

	it('Validations.range should throw error when attributes min and/or max are missing', function() {
		var def = {
			"type": "range" 
		};
		expect(function() {validations.create(def);}).to.throw(Error);
		def.max = 10;
		expect(function() {validations.create(def);}).to.throw(Error);
		def.max = undefined;
		def.min = 1;
		expect(function() {validations.create(def);}).to.throw(Error);	
	});	

	it('Validations.range should return a function that validates whether a given number is between a specified range or not', function() {
		var def = {
			"type": "range",
			"min": 1,
			"max": 4 
		};
		var rangeValidation = validations.create(def);
		expect(rangeValidation(1)).to.be.true;
		expect(rangeValidation(3)).to.be.true;
		expect(rangeValidation(4)).to.be.true;
		expect(typeof rangeValidation("A")).to.equal('string');
		expect(typeof rangeValidation(66)).to.equal('string');
		expect(typeof rangeValidation(0)).to.equal('string');
	});	

	it('Validations.generate to return a function that performs all the specified validations in a given value', function() {
		var defs = [
			{
				"type": "number"
			},					
			{
				"type": "range",
				"max": 100,
				"min": 10
			}			
		];
		var multipleValidations = validations.generate(defs);
		expect(multipleValidations("ABCD")).to.equal("Please enter a valid number");
		expect(multipleValidations(5)).to.equal("Enter a value between 10 and 100");
		expect(multipleValidations(50)).to.be.true;
	});

});