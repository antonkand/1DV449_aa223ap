'use strict';
module.exports = function (app) {
	console.log('app in scraper.js');
	console.log(app);
	app.get('/scraper', function (req, res) {
		res.render('scraper');
	});
}

