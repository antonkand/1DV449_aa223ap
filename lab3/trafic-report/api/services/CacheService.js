'use strict';
// npm deps
var fs = require('fs');
var appRoot = require('app-root-path');
// vars
var timestamp = appRoot + '/latest_cache.json';
exports.overwriteTimeStamp = function () {
    fs.writeFile('latest_cache.json', JSON.stringify({ latest_cache: new Date()}, null, 4),  function(err) {
        if(err) {
            console.log('overwriteTimestamp error: ' + err);
        }
        else {
            console.log('latest cache saved to latest_cache.json');
        }
    });
};

exports.cacheHasExpired = function () {
    try {
        var cachedDate = new Date(require(timestamp).latest_cache).getTime() || null;
        if (cachedDate) {
            var now = new Date().getTime();
            return (now - cachedDate >= 120000); // true if cache is less then one minutes ago
        }
        else {
            return true;
        }
    }
    // couldn't load saved json,
    // new request needed
    catch (error) {
        console.log('cacheHasExpired: couldn\'t read file.');
        return true;
    }
};
