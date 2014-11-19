'use strict';
var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var logger = require('express-logger');
var chalk = require('chalk');
var middleware = require('./middleware/middleware.js');
var MainController = require('./controllers/MainController.js');

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
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8080);
app.use(middleware.clusterlog);

var start = function () {
    app.listen(app.get('port'), function () {
        console.log(chalk.cyan('james-node '
        + chalk.white('port: '
        + app.get('port')
        + '. environment: '
        + app.get('env')
        + '.')
        ));
    });
};

// handles routing and control of routes
MainController.init(app);

// if run directly, start server
if (require.main === module) {
    start();
}
// else it's required(), export start
else {
    // logs which worker that's handling requests
    module.exports = start;
}

