// keeps app.js free from routing
'use strict';
var coursepress = require('../scraper/coursepress/coursepress.js');
module.exports = function (app) {
	// index.html
	app.get('/', function (req, res) {
		res.render('index');
	});

	// scraped json from coursepress
	app.get('/coursepress', function (req, res) {
		var scraped = require('../public/scraped_data/' + coursepress.filename);
		res.json(scraped);
	});
};
