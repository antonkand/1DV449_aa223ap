'use strict';
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var consolidate = require('consolidate');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');

// leave app.js free from routes,
// put them in routes.js instead
require('./routes/routes.js')(app);

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Tiny scraper app listening at http://%s:%s', host, port)
})
