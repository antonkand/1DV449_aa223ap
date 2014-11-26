'use strict';
module.exports = function(app, passport) {
    require('./messaging.js')(app);
    var csurf = require('csurf');
    var csrfMiddleware = require('../lib/middleware.js').csrf;
    app.use(csurf());
    app.use(csrfMiddleware);
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });
    require('./login.js')(app, passport);
    require('./signup.js')(app, passport);
    app.use(require('../lib/middleware.js').clusterlog);
};

