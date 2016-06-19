'use strict';

var chai = require('chai');
var expect = chai.expect;

var Assert = require('../src/assert.js').Assert;

describe('Assert', function() {
    it('Assert.isDefined should throw error if value is undefined', function() {
        var v = {};
        expect(function() {Assert.isDefined(v.property, 'Error message');}).to.throw(Error);
    });

    it('Assert.isDefined should not throw error if value is defined', function() {
        var v = {};
        v.property = "abcd";
        expect(function() {Assert.isDefined(v.property, 'Error message');}).to.not.throw(Error);
    });

    it('Assert.isArray should throw error if value is not an array', function() {
        var v = {};
        v.property = "abcd";
        expect(function() {Assert.isArray(v.property, 'Error message');}).to.throw(Error);
    });

    it('Assert.isArray should not throw error if value is an empty array', function() {
        var v = {};
        v.property = [];
        expect(function() {Assert.isArray(v.property, 'Error message');}).to.not.throw(Error);
    });

    it('Assert.isArray should not throw error if value is an array', function() {
        var v = {};
        v.property = ["abcd", "efgh"];
        expect(function() {Assert.isArray(v.property, 'Error message');}).to.not.throw(Error);
    }); 
});