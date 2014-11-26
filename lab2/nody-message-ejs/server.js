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

var path = require('path');

mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({ secret: 'nody-message' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./routes/routes.js')(app, passport);

function start () {
    app.listen(port);
        console.log(
            chalk.cyan('nody-message: ') + 'listening on ' + port + '.'
        );
};

// if run directly, start server
if (require.main === module) {
    start();
}
// else it's required(), export start
else {
    // logs which worker that's handling requests
    module.exports = start;
}