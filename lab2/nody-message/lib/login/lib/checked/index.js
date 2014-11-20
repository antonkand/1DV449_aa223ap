'use strict';

var checked = {};

// Checks the variable by calling toString.
// Comparison passed in should be in format '[object TypeOfObject]'.
// Ie: checkObject('string', '[object String]');
function checkObject (variable, comparison) {
		return Object.prototype.toString.call(variable) === comparison;
}

// Makes use of Array's prototype method if present.
// They're basically the same, anyhow.
if (Array.prototype.isArray) {
	checked.isArray = Array.prototype.isArray;
}
else {
	checked.isArray = function (variable) {
			return checkObject(variable, '[object Array]');
	};
}

checked.isFunction = function (variable) {
	return checkObject(variable, '[object Function]');
};

checked.isNumber = function (variable) {
	return checkObject(variable, '[object Number]');
};

checked.isRegExp = function (variable) {
	return checkObject(variable, '[object RegExp]');
};

checked.isString = function (variable) {
	return checkObject(variable, '[object String]');
};

module.exports = checked;
