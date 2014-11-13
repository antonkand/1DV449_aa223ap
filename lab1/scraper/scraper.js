'use strict';
var chalk = require('chalk');
var coursepress = require('./coursepress/coursepress.js');
var json = null;
var courses = 0;
var numberOfCourses = 0;
try {
	json = require('../public/scraped_data/coursepress.json');
	var courses = json.courses;
	var numberOfCourses = json.scraped_courses;
}
catch (error) {
	json = null;
}


module.exports = function (app) {
	console.log(
		chalk.bgWhite.black('\n Scraper.js running. \n')
	);

app.get('/scraper', function (req, res) {
	res.render('scraper', {
			url: coursepress.url,
			jsonlink: coursepress.jsonlink || '' ,
			jsonname: coursepress.filename.toUpperCase() ||	'',
			courses: courses,
			number_of_courses: numberOfCourses
		});
	});
	coursepress.scrape();
};

