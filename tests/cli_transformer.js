'use strict';

var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var Transformer = require('../src/cli_transformer.js').Transformer;
var transformer = new Transformer();

describe('Transformer', function() {
	it('Transformer.create should throw error when type is unknown', function() {
		var def = {
			"type": "unknown"
		};
		expect(function() {transformer.create(def);}).to.throw(Error);
	});

	it('Transformer.input should throw error when id/label attribute is missing', function() {
		var def = {
			"id": "created_by",
			"type": "input"
		};
		expect(function() {transformer.create(def);}).to.throw(Error, /Missing label attribute in/);
		def.id = undefined;
		def.label = "Created By";
		expect(function() {transformer.create(def);}).to.throw(Error, /Missing id attribute in/);
	});	

	it('Transformer.input should create a simple input form element when all attributes are specified', function() {
		var def = {
			"id": "created_by",
			"type": "input",
			"label": "Created By"
		};
		var element = transformer.create(def);
		expect(element.type).to.equal(def.type);
		expect(element.name).to.equal(def.id);
		expect(element.message).to.equal(def.label);
		expect(element.validate).to.be.undefined;
		expect(element.when).to.be.undefined;
	});		

	it('Transformer.input should create an input form element with validation when validations attribute is specified', function() {
		var def = {
			"id": "created_by",
			"type": "input",
			"label": "Created By",
			"validations": [
				{
					"type": "number"
				}
			]
		};
		var element = transformer.create(def);
		expect(element.type).to.equal(def.type);
		expect(element.name).to.equal(def.id);
		expect(element.message).to.equal(def.label);
		expect(element.validate).to.not.be.undefined;
		expect(typeof element.validate).to.equal('function');
		expect(element.when).to.be.undefined;
	});			

	it('Transformer.input should create an input form element with validation and a when function if all the attributes are specified', function() {
		var def = {
			"id": "created_by",
			"type": "input",
			"label": "Created By",
			"validations": [
				{
					"type": "number"
				}
			],
			"enabled": {
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
			}
		};
		var element = transformer.create(def);
		expect(element.type).to.equal(def.type);
		expect(element.name).to.equal(def.id);
		expect(element.message).to.equal(def.label);
		expect(element.validate).to.not.be.undefined;
		expect(typeof element.validate).to.equal('function');
		expect(element.when).to.not.be.undefined;
		expect(typeof element.when).to.equal('function');
	});

	it('Transformer.enum should throw error when id/label/data_source attributes are missing', function() {
		var def = {
			"id": "cancelled_reason",
			"type": "enum",
			"data_source": {
				"type": "const_array",
				"value": ["ENDUSER", "OTHERS"]
			}				
		};
		expect(function() {transformer.create(def);}).to.throw(Error, /Missing label attribute in/);
		def.label = "Cancelled Reason";
		def.id = undefined;
		expect(function() {transformer.create(def);}).to.throw(Error, /Missing id attribute in/);
		def.id = "cancelled_reason";
		delete def.data_source;
		expect(function() {transformer.create(def);}).to.throw(Error, /Missing data_source attribute in/);		
	});

	it('Transformer.enum should create a simple enum form element when all mandatory attributes are specified', function() {
		var def = {
			"id": "cancelled_reason",
			"type": "enum",
			"label": "Cancelled Reason",
			"data_source": {
				"type": "const_array",
				"value": ["ENDUSER", "OTHERS"]
			}				
		};

		var enumElement = transformer.create(def);
		expect(enumElement.type).to.equal('list');
		expect(enumElement.name).to.equal(def.id);
		expect(enumElement.message).to.equal(def.label);
		expect(enumElement.choices).to.not.be.undefined;
		expect(typeof enumElement.choices).to.equal('function');
		expect(enumElement.validate).to.be.undefined;
		expect(enumElement.when).to.be.undefined;		
	});	

	it('Transformer.enum should create a enum form element with when function if all attributes are specified', function() {
		var def = {
			"id": "cancelled_reason",
			"label": "Cancelled Reason",
			"type": "enum",
			"enabled" : {
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
			},
			"data_source": {
				"type": "const_array",
				"value": ["ENDUSER", "OTHERS"]
			}				
		};

		var enumElement = transformer.create(def);
		expect(enumElement.type).to.equal('list');
		expect(enumElement.name).to.equal(def.id);
		expect(enumElement.message).to.equal(def.label);
		expect(enumElement.choices).to.not.be.undefined;
		expect(typeof enumElement.choices).to.equal('function');
		expect(enumElement.validate).to.be.undefined;
		expect(enumElement.when).to.not.be.undefined;
		expect(typeof enumElement.when).to.equal('function');
	});

	it('Transformer.enum should create a enum form element and all expected functionality like values, activate to work', function() {
		var def = {
			"id": "cancelled_reason",
			"label": "Cancelled Reason",
			"type": "enum",
			"enabled" : {
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
			},
			"data_source": {
				"type": "const_array",
				"value": ["ENDUSER", "OTHERS"]
			}				
		};

		var enumElement = transformer.create(def);
		expect(enumElement.choices()).to.deep.equal(["ENDUSER", "OTHERS"]);
		var answers = {
			"status" : "COMPLETED"
		};
		expect(enumElement.when(answers)).to.be.false;
		answers.status = "CANCELLED";
		expect(enumElement.when(answers)).to.be.true;				
	});

	it('Transformer.transform should create a form with provided set of elements', function(){
		var formDef = JSON.parse(fs.readFileSync(path.join(__dirname, '../formdefs/test_form.json'), 'utf8'));
		var elements = transformer.transform(formDef.form);
		expect(Array.isArray(elements)).to.be.true;
		expect(elements.length).to.equal(3);
		expect(elements[0].type).to.equal('input');
		expect(elements[1].type).to.equal('list');
		expect(elements[2].type).to.equal('input');
	});	
});
