'use strict';

var ValueSources = require('./valuesource.js').ValueSources;
var Operators = require('./operators.js').Operators;
var Assert = require('./assert.js').Assert;

var valuesource = new ValueSources();
var operators = new Operators();

var Conjunctions = function() {};

Conjunctions.prototype.condition = function(conjunctionDef) {
    Assert.isDefined(conjunctionDef.lhs, "Missing lhs attribute in: " + JSON.stringify(conjunctionDef));
    Assert.isDefined(conjunctionDef.rhs, "Missing rhs attribute in: " + JSON.stringify(conjunctionDef));
    Assert.isDefined(conjunctionDef.op, "Missing op attribute in: " + JSON.stringify(conjunctionDef));
    var lhsFn = valuesource.create(conjunctionDef.lhs);
    var rhsFn = valuesource.create(conjunctionDef.rhs);
    var op = operators.create(conjunctionDef.op);
    return function(answers) {
        var lhs = lhsFn(answers);
        var rhs = rhsFn(answers);
        return op(lhs, rhs);
    };
};

Conjunctions.prototype.create = function(conjunctionDef) {
    var self = this;
    var conjunction = self[conjunctionDef.type];
    if(!conjunction) {
        throw new Error("Unknown conjunction type: " + JSON.stringify(conjunctionDef));
    } else {
        return conjunction(conjunctionDef);
    }   
};

exports.Conjunctions = Conjunctions;