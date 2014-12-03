'use strict';
// npm deps
var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var logger = require('express-logger');
var chalk = require('chalk');
var mongoose = require('mongoose');

// lib deps
var middleware = require('./lib/middleware/middleware.js');
var TrafficController = require('./api/controllers/TrafficController.js');

// morgan used for logging when developing
// logging once per 24 h in prod
switch (app.get('env')) {
    case 'development':
        app.use(morgan('dev'));
        break;
    case 'production':
        app.use(logger({
            path: __dirname + '/log/requests.log'
        }));
        break;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8080);

mongoose.connect('mongodb://localhost:27017/lab3');

var start = function () {
    app.listen(app.get('port'), function () {
        console.log(chalk.cyan('eames '
        + chalk.white('port: '
        + app.get('port')
        + '. environment: '
        + app.get('env')
        + '.')
        ));
    });
};

// handles routing and control of routes
TrafficController(app);

// if run directly, start server
if (require.main === module) {
    start();
}
// else it's required(), export start
else {
    // logs which worker that's handling requests
    app.use(middleware.clusterlog);
    module.exports = start;
}

