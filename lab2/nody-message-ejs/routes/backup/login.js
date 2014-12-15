'use strict';
module.exports = function (app, passport) {
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
        });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/messageboard',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}