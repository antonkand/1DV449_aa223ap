'use strict';
// npm dependencies
var chalk = require('chalk');
var path = require('path');
var cookieparser = require('cookie-parser');
var bodyparser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// custom dependencies
var checked = require('./lib/checked');
var LoginController = require('./controllers/LoginController.js');
var config = require('./lib/config');

// local vars
var socialMediaLoginView = path.dirname(require.main.filename); // app's rootdir, used when merging views
//var socialMediaLoginView = __dirname + '/views'; // used when merging with app's views
var rootDir = path.dirname(require.main.filename); // app's rootdir, used when merging views
var start = function (app) {
    try {
        app.use(session({
            secret: config.session.get(),
            saveUninitialized: true,
            resave: true
        }));
        app.use(passport.initialize());
        // persistent sessions
        app.use(passport.session());
        // flash messages to the user
        app.use(flash());
        LoginController.init(
            app, // express app
            passport, // our passport that's setup
            config.routing.getLoggedOut(), // route for logged out users
            config.views.getLoggedOut(), // view for logged out users
            config.routing.getLoggedIn(), // route for logged in users
            config.views.getLoggedIn(), // view for logged in users
            config.views.getFolder(), // views folder for main app
            socialMediaLoginView,
            rootDir
        );
    }
    catch (error) {
        console.log(
            'social-media-login crashed.'
        );
        throw new Error(error);
    }
};

exports.config = config;
exports.start = start;