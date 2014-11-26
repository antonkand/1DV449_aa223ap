'use strict';
module.exports = function (app, Message, messagesArray) {
    var SSE = require('express-sse');
    var sseSource = new SSE(messagesArray);
    app.get('/stream', sseSource.init);
    sseSource.send();
    app.post('/stream', function (req, res) {
        console.log(req.body);
        messagesArray.push(req.body);
        new Message({
            user: req.body.user,
            message: req.body.message,
            date: req.body.date
        }).save();
        sseSource.updateInit(messagesArray);
        sseSource.send(req.body);
    });
};