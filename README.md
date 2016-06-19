# dynaform-cli
A demo of dynamic forms configuration using JSON and a CLI to fill data in a form

## Usage
- Clone this git repo to your machine
- Download and install nodejs [from here.](https://nodejs.org/en/download/)
```bash
cd {PATH TO CLONED REPO}
npm install 
```
- Issue the below command to run a support ticket form example
```bash
node src/dynaform_cli.js formdefs/support_ticket_form.json
```
- To run the tests issue command
```bash
mocha tests
```

Any type of form can be defined using the JSON definition file. For a detailed explanation of the JSON elements and supported attributes please refer next section.

##JSON Form definition
###1. Form
Form is the root of a form def JSON. 
#### Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|id|String|-|Yes|Unique ID for the form|
|elements|Array|-|Yes|Array describing elements of the form|

#####Example
```json
{
	"form": {
		"id" : "sample_form",
		"elements" : []
	}
}
```

###2. Elements
A form can have multiple elements in a specified order.
#### Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|id|String|-|Yes|Unique ID for the element, will be used to refer from other elements|
|label|String|-|Yes|Display name for the element|
|type|String|input``|``enum|Yes|Type of the element: <br>**input** - Simple text input <br>**enum** - Enumerated input i.e. dropdown list|
|validations|Array|-|No|A collection of validation objects to be applied for this element|
|enabled|Object|-|No|A configuration object that can evaluate to a Boolean to indicate whether or not this form element is active and editable|
|data_source|Object - Value Source|-|Yes - for **enum** type elements **only**|A configuration object specifying a data source for the enum input with a list of choices to be shown|

#####Example
```json
[
	{
		"id": "description",
		"label": "Description",
		"type": "input"
	},
	{
		"id": "status",
		"label": "Status",
		"type": "enum",
		"data_source": {
			"type": "const_array",
			"value": ["CANCELLED", "COMPLETED"]
		}						
	}	
]
```

###3. Validations
A form element can have any number of validations applied to itself in the order defined using "validations" attribute mentioned earlier.

####a. Number validation
This can be applied to a input element to check if the value entered is a valid number.
#####Example
```json
{
	"type": "number"
}
```
####b. Range validation
This can be applied to a number input element to check if the entered value is within an acceptable range.

#####Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|type|String|range|Yes|Indicates the type of this validation|
|min|Number|-|Yes|Specifies the lower limit of this range|
|max|Number|-|Yes|Specifies the upper limit of this range|

#####Example
```json
{
	"type": "range",
	"max": 4,
	"min": 1
}
```
####Composing validations
Multiple validations can be composed with an AND logic by defining them as elements of an array, order of application of these validations will be same as order of array definition. For e.g. if we would like to make a form input element both numeric and within a range of 1 to 4 then below configuration would do

```json
{
	"id": "severity",
	"label": "Severity",
	"type": "input",
	"validations": [
		{
			"type": "number"
		},					
		{
			"type": "range",
			"max": 4,
			"min": 1
		}
	]				
}
```

###4. Value Sources
A value source is a configuration that specifies how and what value should be fetched for an attribute of the form element. For e.g. can be a constant or an array or another element's value or from DB etc.

####a. Constant and Constant Array
Specifies that the source is a hardcoded constant value or an array
#####Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|type|String|const``|``const_array|Yes|Indicates the type of this value source:<br> **const** - Constant value<br>**const_array** - A constant array|
|value|String``|``Array``|``Number|-|Yes|Specifies the value of this value source|

#####Example
Below valuesource will always return CANCELLED as a value.
```json
{
	"type" : "const",
	"value" : "CANCELLED"
}
```
Below valuesource will always return [1,2,3] as a value.
```json
{
	"type" : "const_array",
	"value" : [1,2,3]
}
```
####b. Element value
Specifies that the value source is another form element.

#####Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|type|String|element_value|Yes|Specifies the type of this value source|
|element|String|-|Yes|Unique ID of the form element to refer for a value|

#####Example
In the below example the value returned from this value source will be the current value of form element named "status"
```json
{
	"type": "element_value",
	"element": "status"
}
```

###5. Conjunctions
A conjunction is a logic that connects the state of one or more form elements. For e.g. a form element can be activated/enabled based on the state of another form element specified by a conjunction rule.

####a. Condition
A conjunction that enables or disables a form element based on a condition evaluation which has a left hand side, an operator and a right hand side. 

#####Attributes
|Name|Type|Values|Required|Description|
|---|---|---|---|---|
|type|String|condition|Yes|Indicates the type of this conjunction|
|lhs|Object - ValueSource|-|Yes|Left hand side expression of a condition|
|rhs|Object - ValueSource|-|Yes|Right hand side expression of a condition|
|op|String|eq``|``ne``|``gt``|``lt``|``ge``|``le|Yes|Operator used to compare the lhs and rhs<br> **eq** - Equals<br>**ne** - Not Equals<br>**gt** - Greater than<br>**lt** - Lesser than<br>**ge** - Greater than or Equals<br>**le** - Lesser than or Equals|

#####Example
Below condition evaluates to true if value of form element with id "status" is "CANCELLED"
```json
{
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
```

######Please refer [this JSON file](https://github.com/Ramasubramanian/dynaform-cli/blob/master/formdefs/support_ticket_form.json) for a complete example of a form definition.

##License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.