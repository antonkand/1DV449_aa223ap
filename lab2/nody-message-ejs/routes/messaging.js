'use strict';
var Message = require('../models/message.js');
var messages = [];
Message.find(function (err, msgs) {
    if (err) {
        return console.error(err);
    }
    else {
        messages.push(msgs);
    }
});
module.exports = function (app) {
    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user
        });
    });
//app.get('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    app.get('/messages', function(req, res) {
        // TODO: se till att user ar authad innan post
        res.json([{message: 'msg1', user: 'user1'}, {message: 'msg2', user: 'user2'}]);
});
//app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    app.post('/messages', function(req, res) {
        // TODO: se till att user ar authad innan post
        res.json(req.body);
        messages.push(req.body);
        new Message({
            user: req.body.user,
            message: req.body.message,
            date: req.body.date
        }).save();
    });
}
