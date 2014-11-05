'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var coursepress = require('./coursepress/coursepress.js');
var scraped = {
	site: coursepress.options.url,
	imgsrc: [],
	title: '',
	date_scraped: Date()
};

module.exports = function (app) {
	console.log(
		'app in scraper.js'
	);
	app.get('/scraper', function (req, res) {

		request(coursepress.options, function(error, response, html){
			if (!error) {
				var loader = cheerio.load(html);

				loader('#blogs-list').filter(function () {
					var data = loader(this);
					Object.keys(data[0].attribs).forEach(function (element) {
						console.log(data[0].attribs[element]);
						// scraped.imgsrc.push(data[0].attribs['src']);
					});
				});
			}
			var filename = 'scraped.json';
			fs.writeFile('public/scraped_data/' + filename, JSON.stringify(scraped, null, 4), function(err){
				if (err) {
					throw err;
				}
				console.log('Scraper saved to JSON: ' + filename);
			})
		});

		res.render('scraper', {
			url: scraped.site,
			images: scraped.imgsrc
		});
	});
}

