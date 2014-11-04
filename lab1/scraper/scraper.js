'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = 'http://www.svtplay.se/';
var scraped = {
	site: url,
	imgsrc: [],
	title: '',
	date_scraped: Date()
}

// not yet implemented
// var Nightmare = require('nightmare');
// var user = require('./user/user.js');
// var fb = require('./lib/fblogin/fblogin.js');
// put inside of request
		// login to facebook
		// new Nightmare()
		// .use(fb.login(user.email, user.pw))
		// .run();

		// request the user's profile after login
		// var url = user.fbprofile + '/photos';

module.exports = function (app) {
	console.log('app in scraper.js');
	app.get('/scraper', function (req, res) {

		request(url, function(error, response, html){
			if (!error) {
				var loader = cheerio.load(html);

				loader('.play_videolist-element__thumbnail-image').filter(function () {
					var data = loader(this);
					Object.keys(data[0].attribs).forEach(function (element) {
						console.log(data[0].attribs[element]);
						scraped.imgsrc.push(data[0].attribs['src']);
					});
				});
			}
			fs.writeFile('scraped_data/scraped.json', JSON.stringify(scraped, null, 4), function(err){
				if (err) {
					throw err;
				}
				console.log('Scraper saved to JSON: scraped.json');
			})
		});

		res.render('scraper', {
			url: scraped.site,
			images: scraped.imgsrc
		});
	});
}

