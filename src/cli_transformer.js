'use strict';

var Validations = require('./validations.js').Validations;
var Conjunctions = require('./conjunctions.js').Conjunctions;
var ValueSources = require('./valuesource.js').ValueSources;
var Assert = require('./assert.js').Assert;

var validations = new Validations();
var conjunctions = new Conjunctions();
var valuesources = new ValueSources();

var Transformer = function () {};

Transformer.prototype.input = function(element) {
	Assert.isDefined(element.id, "Missing id attribute in: " + JSON.stringify(element));
	Assert.isDefined(element.label, "Missing label attribute in: " + JSON.stringify(element));
	var ret = {};
	ret.type = element.type;
	ret.name = element.id;
	ret.message = element.label;	
	if(element.validations) {
		ret.validate = validations.generate(element.validations);
	}
	if(element.enabled) {
		ret.when = conjunctions.create(element.enabled);
	}
	return ret;
};

Transformer.prototype.enum = function(element) {
	Assert.isDefined(element.id, "Missing id attribute in: " + JSON.stringify(element));
	Assert.isDefined(element.label, "Missing label attribute in: " + JSON.stringify(element));
	Assert.isDefined(element.data_source, "Missing data_source attribute in: " + JSON.stringify(element));	
	var ret = {};
	ret.type = 'list';
	ret.name = element.id;
	ret.message = element.label;	
	if(element.validations) {
		ret.validate = validations.generate(element.validations);
	}
	if(element.enabled) {
		ret.when = conjunctions.create(element.enabled);
	}	
	if(element.data_source) {
		ret.choices = valuesources.create(element.data_source);
	}
	return ret;
};

Transformer.prototype.create = function(elementDef) {
	var self = this;
	var element = self[elementDef.type];
	if(!element) {
		throw new Error("Unknown element type: " + JSON.stringify(elementDef));
	} else {
		return element(elementDef);
	}
};

Transformer.prototype.transform = function(form) {
	var self = this;
	var questions = form.elements.map(function(element) {
		return self.create(element);
	});
	return questions;
};

exports.Transformer = Transformer;