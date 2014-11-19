'use strict';
exports.init = function (app) {
	app.get('/', function (req, res) {
		res.render('main');
	});

	app.get('/login', function (req, res) {
		res.render('login');
	});
};