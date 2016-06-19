'use strict';

var Operators = function() {};

Operators.prototype.eq = function(lhs, rhs) {
    return lhs == rhs;
};

Operators.prototype.ne = function(lhs, rhs) {
    return lhs != rhs;
};

Operators.prototype.gt = function(lhs, rhs) {
    return lhs > rhs;
};

Operators.prototype.lt = function(lhs, rhs) {
    return lhs < rhs;
};

Operators.prototype.ge = function(lhs, rhs) {
    return lhs >= rhs;
};

Operators.prototype.le = function(lhs, rhs) {
    return lhs <= rhs;
};

Operators.prototype.create = function(operator) {
    var self = this;
    var op = self[operator];
    if(!op) {
        throw new Error("Unknown operator: " + operator);
    } else {
        return op;
    }
};

exports.Operators = Operators;