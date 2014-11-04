'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = 'http://www.svtplay.se/';
var jadeVars = {
	site: url,
	img: {},
	title: ''
}

// not yet implemented
var Nightmare = require('nightmare');
var user = require('./user/user.js');
var fb = require('./lib/fblogin/fblogin.js');


module.exports = function (app) {
	console.log('app in scraper.js');
	app.get('/scraper', function (req, res) {
		// login to facebook
		// new Nightmare()
		// .use(fb.login(user.email, user.pw))
		// .run();

		// request the user's profile after login
		// var url = user.fbprofile + '/photos';


		request(url, function(error, response, html){
			if (!error) {
				var loader = cheerio.load(html);
				var name, profilepic;
				var json = {
					name: '',
					profilepic: ''
				};

				loader('.play_videolist-element__thumbnail-image').filter(function () {
					var data = loader(this);
					// console.log(data);
					jadeVars.imgsrc = data[0].attribs.src;
					console.log(jadeVars.imgsrc);
				});
			}
		});
		fs.writeFile('scraped_data/scraped.json', JSON.stringify(jadeVars, null, 4), function(err){
			if (err) {
				throw err;
			}
			console.log('Scraper saved to JSON: scraped.json');
    })


		res.render('scraper', {
			url: jadeVars.site,
			images: jadeVars.imgsrc
		});
	});
}

