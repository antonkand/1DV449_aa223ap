'use strict';
var chalk = require('chalk');

exports.init = function (app, passport, route, view, signedUpView) {
    console.log(route);
    console.log(view);
    app.get(route, function(req, res) {
        res.render(view, { message: req.flash('signupMessage') });
    });
    app.post(route, passport.authenticate('local-signup', {
        successRedirect : signedUpView,
        failureRedirect : view,
        failureFlash : true
    }));

};