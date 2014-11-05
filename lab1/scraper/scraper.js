'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var chalk = require('chalk');
var coursepress = require('./coursepress/coursepress.js');
var scraped = {
	site: coursepress.options.url,
	courses: [],
	scraped_courses: 0,
	date_scraped: new Date()
};

// renders a console header used on init
var displayHeader = function () {
	return console.log(
		chalk.bgWhite.black('\n   Scraper.js running.  \n')
	);
};

var timeLimitHasPassed = function () {
	var now = new Date();
};


// writes the scraped data to file
var saveDataToJSON = function () {
		var filename = coursepress.filename;
		fs.writeFile('public/scraped_data/' + filename, JSON.stringify(scraped, null, 4), function(err){
			if (err) {
					throw err;
			}
			console.log('Scraper saved to JSON: ' + filename);
		});
};

module.exports = function (app) {
	displayHeader();
	app.get('/scraper', function (req, res) {
		request(coursepress.options, function(error, response, html){
			if (!error) {
				var loader = cheerio.load(html);
				coursepress.cheerio.getCourses(loader, scraped);
				saveDataToJSON();
			}
		});
		res.render('scraper', {
			url: coursepress.options.url
			// ,
			// jsonlink: coursepress.jsonlink,
			// jsonname: coursepress.filename
		});
	});
};

