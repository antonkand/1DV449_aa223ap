'use strict';

var express = require('express'),
    app = express(),
    consolidate = require('consolidate'),
    path = require('path'),
    chalk = require('chalk');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');

// keep app.js free from routes
require('./routes/routes.js')(app);

var server = app.listen(12345, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(
        chalk.cyan('Project at ' + host + ':' + port)
    );
});