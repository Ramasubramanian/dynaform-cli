'use strict';

var fs = require('fs');
var inquirer = require('inquirer');
var Transformer = require('./cli_transformer.js').Transformer;

if(process.argv.length < 3) {
    console.error("Usage:- node <PATH TO>/dynaform_cli.js <JSON file name with path>");
    process.exit(1);
}

var fileName = process.argv[2];

var formDef = JSON.parse(fs.readFileSync(fileName, 'utf8'));
var transformer = new Transformer();
var questions = transformer.transform(formDef.form);

inquirer.prompt(questions).then(function (answers) {
  console.log(JSON.stringify(answers, null, '  '));
}).catch(function(e) {
    console.error("Error occurred, exiting!");
    console.error(e.stack);
    process.exit(1);
});