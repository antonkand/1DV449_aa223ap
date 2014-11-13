'use strict';
var express = require('express');
var app = express();
var path = require('path');
var chalk = require('chalk');
var consolidate = require('consolidate');
var scraper = require('./scraper/scraper.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('jade', consolidate.jade);
app.set('view engine', 'jade');

// leave app.js free from routes,
// put them in routes.js instead
require('./routes/routes.js')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(
  	chalk.cyan('Tiny scraper app listening at ' + host + ':' + port)
  );
});
