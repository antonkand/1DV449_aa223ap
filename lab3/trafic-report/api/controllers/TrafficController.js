'use strict';
var chalk = require('chalk');
var TrafficService = require('../services/TrafficService.js');
var TrafficReport = require('../models/TrafficReport.js');
var responseCallback = function (res, json) {
    res.json(json);
};
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/traffic-data', function (req, res) {
        return TrafficService.cacheHasExpired()
            ?   TrafficService.requestData(res, responseCallback)
            :   TrafficReport.find({}, function (err, report) {
                console.log(chalk.cyan('traffic-data: ') + 'cache still up to date, querying DB.');
                    if (err) {
                        throw new err;
                    }
                    else {
                        res.json(report);
                    }
                });
    });
};
