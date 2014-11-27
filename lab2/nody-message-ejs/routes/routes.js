'use strict';
module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });
    require('./login.js')(app, passport);
    require('./signup.js')(app, passport);
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
                }
            });
            require('./messaging.js')(app, Message, messages);
        }
    });
    app.use(require('../lib/middleware.js').clusterlog);
};

