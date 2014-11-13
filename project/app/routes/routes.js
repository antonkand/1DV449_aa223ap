'use strict';

/*
 * Contains all the routes for the app.
 * @param {function} app an express.io app that will be bound to the routes
 * */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
}
