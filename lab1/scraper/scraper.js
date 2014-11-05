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
	date_scraped: Date()
};
var displayHeader = function () {
	return console.log(
		chalk.bgWhite.black('\n   Scraper.js running.  \n')
	);
}

module.exports = function (app) {
	displayHeader();
	app.get('/scraper', function (req, res) {

		request(coursepress.options, function(error, response, html){
			if (!error) {
				var loader = cheerio.load(html);

				// loader('#blogs-list').filter(function () {
				// 	var data = loader(this);
				// 	Object.keys(data[0]).forEach(function (element) {
				// 		console.log(data[0][element]);
				// 		// scraped.imgsrc.push(data[0].attribs['src']);
				// 	});

				// });
				loader('.item-title a').filter(function () {
					var data = loader(this);
					Object.keys(data).forEach(function () {
						var course = {
							coursename: data.text(),
							url: data[0].attribs['href']
						};
						scraped.courses.push(course);
						scraped.scraped_courses = scraped.courses.length;
					});
				});
			}
			var filename = 'scraped.json';
			fs.writeFile('public/scraped_data/' + filename, JSON.stringify(scraped, null, 4), function(err){
				if (err) {
					throw err;
				}
				console.log('Scraper saved to JSON: ' + filename);
			});
		});

		res.render('scraper', {
			url: coursepress.options.url,
			courses: scraped.courses
		});
	});
};

