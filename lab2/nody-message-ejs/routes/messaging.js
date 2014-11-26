'use strict';
module.exports = function (app, Message, messagesArray) {
    var SSE = require('express-sse');
    var sseSource = new SSE(messagesArray);
    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user
        });
    });
//app.get('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    app.get('/messages', function(req, res) {
        // TODO: se till att user ar authad innan get
        res.json(messagesArray);
    });
    app.get('/stream', sseSource.init);
//app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    app.post('/messages', function(req, res) {
        // TODO: se till att user ar authad innan post
        res.json(req.body);
        messagesArray.push(req.body);
        console.log(req.body);
        new Message({
            user: req.body.user,
            message: req.body.message,
            date: req.body.date
        }).save();
        sseSource.send(messagesArray);
    });
}
