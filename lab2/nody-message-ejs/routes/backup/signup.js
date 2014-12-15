'use strict';
module.exports = function (app, passport) {
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/messageboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));
};