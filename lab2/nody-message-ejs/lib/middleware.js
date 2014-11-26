'use strict';
var middleware = {};
var cluster = require('cluster');
var chalk = require('chalk');
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

// logs which worker that's handling requests
middleware.clusterlog = function (req, res, next) {
    if (cluster.isWorker) {
        console.log(
            chalk.cyan('nody-message ')
            + 'clusterlog: worker %d handling request.', cluster.worker.id
        );
        next();
    }
}
module.exports = middleware;
