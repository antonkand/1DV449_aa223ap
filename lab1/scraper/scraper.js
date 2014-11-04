'use strict';
var request = require('request');
var cheerio = require('cheerio');
var Nightmare = require('nightmare');
var user = require('./user/user.js');
var fb = require('./lib/fblogin/fblogin.js');

module.exports = function (app) {
	console.log('app in scraper.js');
	app.get('/scraper', function (req, res) {
		// new Nightmare()
		// 	.use(fb.login(user.email, user.pw))
		// 	.type('#u_0_10', 'test')
		// 	.click('button[type="submit"]')
		// 	.run();
		res.render('scraper');
	});
}

