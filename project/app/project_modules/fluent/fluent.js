// creates a fluent interface of an object's methods
// source: http://jsfiddle.net/tarabyte/4C4Lu/

'use strict';

module.exports = function (obj) {
    Object.keys(obj).forEach(function(key){
        var member = obj[key];
        if(typeof member === "function" && !/\breturn\b/.test(member)){
            obj[key] = function() {
                member.apply(this, arguments);
                return this;
            }
        }
    });
};