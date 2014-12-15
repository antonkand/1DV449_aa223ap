'use strict';
var csrf = require('csurf');
module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });
    require('./login.js')(app, passport);
    require('./signup.js')(app, passport);
    app.use(csrf());
    var Message = require('../models/message.js');
    var messages = [];
    Message.find(function (err, msgs) {
        if (err) {
            return console.error(err);
        }
        else {
            messages = msgs.map(function(element){
                return {
                    message: element.message,
                    user: element.user,
                    date: element.date
                };
            });
        }
    });
    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user,
            csrfToken: req.csrfToken()
        });
    });
    app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        var sanitized = {
            user: req.sanitize(req.body.user),
            message: req.sanitize(req.body.message),
            date: req.sanitize(req.body.date)
        }
        messages.push(sanitized);
        console.log(sanitized);
        new Message({
            user: sanitized.user,
            message: sanitized.message,
            date: sanitized.date
        }).save();
        sseSource.send(messages);
        return res.json(sanitized);
    });
    app.use(require('../lib/middleware.js').clusterlog);
};

