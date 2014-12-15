'use strict';
    var Message = require('../models/message.js');
    var messages = [];
module.exports = function(app, passport) {
    require('./login.js')(app, passport);
    require('./signup.js')(app, passport);
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });
    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user
        });
    });
    app.get('/messages', require('../lib/middleware.js').isLoggedIn, function (req, res) {
        var respondToRequest = function () {
            console.log('on postAdded');
            return res.json(messages);
        };
        //postEmitter.on('postAdded', respondToRequest);
    });
    app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        var sanitized = {
            user: req.sanitize(req.body.user),
            message: req.sanitize(req.body.message),
            date: req.sanitize(req.body.date)
        };
        //postEmitter.emit('postAdded');
        messages.push(sanitized);
        console.log(sanitized);
        new Message({
            user: sanitized.user,
            message: sanitized.message,
            date: sanitized.date
        }).save();
        //sseSource.send(messagesArray);
        return res.json(sanitized);
    });

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
                }
            });
            require('./messaging.js')(app, Message, messages);
        }
    });
    app.use(require('../lib/middleware.js').clusterlog);
};

