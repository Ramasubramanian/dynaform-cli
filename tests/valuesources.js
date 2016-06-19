'use strict';

var chai = require('chai');
var expect = chai.expect;

var ValueSources = require('../src/valuesource.js').ValueSources;
var vs = new ValueSources();

describe('ValueSources', function() {
    it('ValueSources.create should throw error if unknown type is specified', function() {
        var def = {
            "type": "unknown" 
        };
        expect(function() {vs.create(def);}).to.throw(Error);
    });

    it('ValueSources.create should throw error if const type is specified and value not provided', function() {
        var def = {
            "type": "const" 
        };
        expect(function() {vs.create(def);}).to.throw(Error);
    }); 

    it('ValueSources.create should not throw error if const type is specified other attributes provided', function() {
        var def = {
            "type": "const",
            "value": 1 
        };
        expect(function() {vs.create(def);}).to.not.throw(Error);
    });     

    it('ValueSources.const should return a function that returns the specified value in def', function() {
        var def = {
            "type": "const",
            "value": 1 
        };
        var constSource = vs.create(def);       
        expect(constSource()).to.equal(1);
    }); 

    it('ValueSources.create should throw error if const_array type is specified and value not provided', function() {
        var def = {
            "type": "const_array" 
        };
        expect(function() {vs.create(def);}).to.throw(Error);
    });     

    it('ValueSources.create should throw error if const_array type is specified and value provided is not an array', function() {
        var def = {
            "type": "const_array",
            "value": 1 
        };
        expect(function() {vs.create(def);}).to.throw(Error);
    });         

    it('ValueSources.const_array should return a function that returns the array provided as value', function() {
        var def = {
            "type": "const_array",
            "value": [1,2,3] 
        };
        var constArraySource = vs.create(def);
        expect(constArraySource()).to.deep.equal([1,2,3]);
    });             

    it('ValueSources.element_value should throw error if element attribute is not specified', function() {
        var def = {
            "type": "element_value"
        };
        expect(function() {vs.create(def);}).to.throw(Error);
    });

    it('ValueSources.element_value should return a function that returns the value of element from answer hash', function() {
        var def = {
            "type": "element_value",
            "element": "field_1"
        };
        var answers = {
            "field_2" : "qqq",
            "field_1" : "abcd"
        };
        var elementValueSource = vs.create(def);
        expect(elementValueSource(answers)).to.equal("abcd");
    }); 
});