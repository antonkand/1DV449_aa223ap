'use strict';
var chalk = require('chalk');
var checked = require('../checked');
var path = require('path');
var rootDir = path.dirname(require.main.filename);
/*
* loginController takes an Express app,
* a main route on which the login should appear,
* the route to redirect to after successful login,
* a view to render for the login form
* and a view to render after successful login
* @param {function} app Express app to use
* @param {string} route The route to use for login form, passed in as '/routename' (optional, defaults to '/login')
* @param {string} view The view to render when displaying the login form (optional, defaults to 'login')
* @param {string} loggedInRoute The route to use when user logs in, as '/routename' (optional, defaults to '/logged-in')
* @param {string} loggedInView The view to render when logged in (optional, defaults to 'logged-in')
* @param {string} viewsFolder The Express apps views (optional, defaults to '/views')
* */
var loginController  = function (app, route, view, loggedInRoute, loggedInView, viewsFolder) {
    // sets the optionals
    var login = {
        route: checked.isString(route) ? route : '/login',
        view: checked.isString(view) ? view : 'login',
        viewsFolder: checked.isString(viewsFolder) ? viewsFolder : '/views'
    };

    try {
        app.set('views', rootDir + login.viewsFolder);
        console.log(
            chalk.cyan('social-media-login ')
            + 'initialized.'
        );
        app.get(login.route, function (req, res) {
            res.render(login.view);
        });
    }
    catch (error) {
        console.log(
            chalk.cyan('social-media-login ')
            + 'Express app not passed in.'
        );
        throw new Error(error);
    }
};

module.exports = loginController;