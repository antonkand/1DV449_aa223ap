'use strict';
// dependencies
var checked = require('../lib/checked');
var chalk = require('chalk');
var merge = require('merge-dirs');

/*
* LoginController takes an Express app,
* a route on which the login should appear,
* the route to redirect to after successful login,
* a view to render for the login form
* and a view to render after successful login
* all views are jade-templates
* @param {function} app Express app to use
* @param {string} route The route to use for login form, passed in as '/routename' (optional, defaults to '/login')
* @param {string} view The view to render before user has logged in (optional, defaults to 'login')
* @param {string} loggedInRoute The route to use when user logs in, as '/routename' (optional, defaults to '/logged-in')
* @param {string} loggedInView The view to render when logged in (optional, defaults to 'logged-in')
* @param {string} viewsFolder The Express apps views (optional, defaults to '/views')
* */
exports.init = function (app, passport, route, view, loggedInRoute, loggedInView, viewsFolder, socialMediaLoginView, rootDir) {
    // sets the optionals
    var login = {
        route: checked.isString(route) ? route : '/login',
        view: checked.isString(view) ? view : 'login',
        viewsFolder: checked.isString(viewsFolder) ? viewsFolder : '/views'
    };

    try {
        merge(socialMediaLoginView, (rootDir + login.viewsFolder + '/partials'));
        app.set('views', rootDir + login.viewsFolder);
        console.log(
            chalk.cyan('social-media-login ')
            + 'initialized.'
        );
        app.get(login.route, function (req, res) {
            res.render(login.view, { message: req.flash('loginMessage') });
        });
    }
    catch (error) {
        console.log(
            chalk.cyan('social-media-login ')
            + chalk.red('crashed.')
        );
        throw new Error(error);
    }
};