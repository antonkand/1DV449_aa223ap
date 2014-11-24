'use strict';
var middleware = {};

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
middleware.csrf = function (req, res, next) {
        res.locals._csrfToken = req.csrfToken();
        next()
};
module.exports = middleware;
