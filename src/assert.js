'use strict';

var Assert = function() {};

Assert.prototype.isDefined = function(value, errorMessage) {
    if(!value) {
        throw new Error(errorMessage);
    }
};

Assert.prototype.isArray = function(value, errorMessage) {
    if(!Array.isArray(value)) {
        throw new Error(errorMessage);
    }
};

exports.Assert = new Assert();