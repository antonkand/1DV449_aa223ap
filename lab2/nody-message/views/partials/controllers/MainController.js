'use strict';
var LoginController = require('../lib/login');
exports.init = function (app) {
	LoginController.start(app);

	app.get('/', function (req, res) {
		res.render('main');
	});
};