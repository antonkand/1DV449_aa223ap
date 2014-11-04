// keeps app.js free from routing
'use strict';
module.exports = function (app) {
	// index.html
	app.get('/', function (req, res) {
		res.render('index');
	});

	// tests nightmare setup
	app.get('/nightmare', function (req, res) {
		console.log('nightmare was here');
	});
};
