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
    var ArrayStream = require('arraystream');
    var messageStream = ArrayStream.create(messagesArray);

    app.get('/messageboard', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        res.render('messageboard.ejs', {
            user: req.user
        });
    });
app.get('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
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
    app.get('/experiment', function (req, res) {
        messagesArray.push({message: 'experiment', user: 'userexperiment', date: new Date()});
        messageStream.on('data', function (value, key) {
            console.log(value);
            console.log(key);
        });
    });
app.post('/messages', require('../lib/middleware.js').isLoggedIn, function(req, res) {
        var sanitized = {
            user: req.sanitize(req.body.user),
            message: req.sanitize(req.body.message),
            date: req.sanitize(req.body.date)
        }
        postEmitter.emit('postAdded');
        messagesArray.push(sanitized);
        console.log(sanitized);
        new Message({
            user: sanitized.user,
            message: sanitized.message,
            date: sanitized.date
        }).save();
        sseSource.send(messagesArray);
        return res.json(sanitized);
    });
}
