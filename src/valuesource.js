'use strict';

var Assert = require('./assert.js').Assert;

var ValueSources = function() {};

ValueSources.prototype.const = function(valueSourceDef) {
	Assert.isDefined(valueSourceDef.value, "Missing value attribute in: " + JSON.stringify(valueSourceDef));
	return function(answers) {
		return valueSourceDef.value;
	};
};

ValueSources.prototype.const_array = function(valueSourceDef) {
	Assert.isDefined(valueSourceDef.value, "Missing value attribute in: " + JSON.stringify(valueSourceDef));
	Assert.isArray(valueSourceDef.value, "Value for value attribute is not an array: " + JSON.stringify(valueSourceDef));
	return function(answers) {
		return valueSourceDef.value;
	};
};

ValueSources.prototype.element_value = function(valueSourceDef) {
	Assert.isDefined(valueSourceDef.element, "Missing element attribute in: " + JSON.stringify(valueSourceDef));
	return function(answers) {
		return answers[valueSourceDef.element];
	};
};

ValueSources.prototype.create = function(valueSourceDef) {
	var self = this;
	var valueSource = self[valueSourceDef.type];
	if(!valueSource) {
		throw new Error("Unknown valueSource type: " + valueSourceDef.type);
	} else {
		return valueSource(valueSourceDef);
	}	
};

exports.ValueSources = ValueSources;