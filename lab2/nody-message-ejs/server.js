var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var chalk = require('chalk');
var configDB = require('./config/database.js');
var csurf = require('csurf');
var csrfMiddleware = require('./lib/middleware.js').csrf;

mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(session({ secret: 'nody-message' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csurf());
app.use(csrfMiddleware);

require('./routes')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log(
    chalk.cyan('nody-message: ') + 'listening on ' + port + '.'
);