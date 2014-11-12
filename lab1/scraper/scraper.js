'use strict';
var chalk = require('chalk');
var coursepress = require('./coursepress/coursepress.js');

module.exports = function (app) {
	console.log(
		chalk.bgWhite.black('\n Scraper.js running. \n')
	);
	app.get('/scraper', function (req, res) {
		coursepress.scrape();
		res.render('scraper', {
			url: coursepress.url,
			jsonlink: coursepress.jsonlink || '' ,
			jsonname: coursepress.filename ||	''
		});
	});
};

