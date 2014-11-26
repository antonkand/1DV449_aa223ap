'use strict';
var EventEmitter = require('events').EventEmitter;
var util = require('util');
function Master () {
    EventEmitter.call(this);
};
util.inherits(Master, EventEmitter);
var postEmitter = new Master();
postEmitter.on('hej', function () {
    console.log('hejsan!');
});
postEmitter.emit('hej');
module.exports = function (app, Message, messagesArray) {
    var SSE = require('express-sse');
    var sseSource = new SSE(messagesArray);
    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user
        });
    });
//app.get('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    // TODO: se till att user ar authad innan get
    app.get('/messages', function(req, res) {
        var respondToRequest = function () {
            console.log('on postAdded');
            return res.json(messagesArray);
        };
        postEmitter.on('postAdded', respondToRequest);
    });
    app.get('/allmessages', function (req, res) {
        res.json(messagesArray);
    });
    app.get('/stream', sseSource.init);

//app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
    // TODO: se till att user ar authad innan post
    app.post('/messages', function(req, res) {
        postEmitter.emit('postAdded');
        messagesArray.push(req.body);
        console.log(req.body);
        new Message({
            user: req.body.user,
            message: req.body.message,
            date: req.body.date
        }).save();
        sseSource.send(messagesArray);
        return res.json(req.body);
    });
}
