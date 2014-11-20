#Checked
###Tiny module for easy typechecking

Checked is used for easy typechecking and works with both Node.js and Browserify. It only does typechecking.

###Installation

**1. cd to your module directory**

```bash
$ cd custom_modules
```

**2. git clone**

```bash
$ git clone git@github.com:antonkandersson/checked.git
```

**3. require the module in your js-file**

```javascript
var checked = require('./custom_modules/checked');
```

###Usage

Use Checked when you want to make sure a variable is of a certain type. Pass in a variable and Checked methods returns either true or false. Checked has the following methods:

* .isArray() 

* .isFunction()

* .isNumber()

* .isRegExp()

* .isString()

###Examples

```javascript
// Only passItOn() if variable assumedString is a string
if (checked.isString(assumedString)) {
	passItOn();	
};

checked.isArray([]); //true
checked.isFunction(function () { return; }); //true
checked.isNumber(123); //true
checked.isRegExp(/checked/gi); //true
checked.isString('checked'); //true
```
