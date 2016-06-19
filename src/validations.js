'use strict';

var Assert = require('./assert.js').Assert;

var Validations = function() {};

Validations.prototype.number = function(validationDef) {
    return function(value) {
        return !isNaN(value) ? true : "Please enter a valid number";
    };
};

Validations.prototype.range = function(validationDef) {
    Assert.isDefined(validationDef.max, "Missing max attribute in: " + JSON.stringify(validationDef));
    Assert.isDefined(validationDef.min, "Missing min attribute in: " + JSON.stringify(validationDef));
    return function(value) {
        var max = validationDef.max;
        var min = validationDef.min;
        return value <= max && value >= min ? true : "Enter a value between " + min + " and " + max;
    };
};

Validations.prototype.create = function(validationDef) {
    var validation = this[validationDef.type];
    if(!validation) {
        throw new Error("Unknown validation type: " + validationDef.type);
    } else {
        return validation(validationDef);
    }
};

Validations.prototype.generate = function(validationDefs) {
    var self = this;
    var functions = validationDefs.map(function(v) { return self.create(v);});
    return function(value) {
        var result;
        for (var i = 0; i < functions.length; i++) {
            result = functions[i](value);
            if(result !== true) {
                return result;
            }
        }
        return true;
    }; 
};

exports.Validations = Validations;