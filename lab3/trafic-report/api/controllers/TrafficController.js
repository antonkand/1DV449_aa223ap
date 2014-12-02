'use strict';
var chalk = require('chalk');
var TrafficService = require('../services/TrafficService.js');
var TrafficReport = require('../models/TrafficReport.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/traffic-data', function (req, res) {
        res.json(TrafficService.loadJSON());
        //return TrafficService.cacheHasExpired()
        //    ? function () {
        //        console.log('requestData');
        //        res.json(TrafficService.requestData())
        //    }
        //    : function () {
        //        console.log('loadJSON');
        //        res.json(TrafficService.loadJSON());
        //    }
    });
};
