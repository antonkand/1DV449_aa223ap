'use strict';
var LoginController = require('../lib/login');
exports.init = function (app) {
	LoginController(app, '/login', 'main', '/logged-in', 'logged-in');

	app.get('/', function (req, res) {
		res.render('main');
	});

};