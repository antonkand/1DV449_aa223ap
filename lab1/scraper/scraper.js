'use strict';
var chalk = require('chalk');
var coursepress = require('./coursepress/coursepress.js');

// renders a console header used on init
var displayHeader = function () {
	return console.log(
		chalk.bgWhite.black('\n   Scraper.js running.  \n')
	);
};

var timeLimitHasPassed = function () {
	var now = new Date();
};

module.exports = function (app) {
	displayHeader();
	app.get('/scraper', function (req, res) {
		coursepress.scrape();
		res.render('scraper', {
			url: coursepress.url
			// ,
			// jsonlink: coursepress.jsonlink,
			// jsonname: coursepress.filename
		});
	});
};

