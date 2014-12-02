'use strict';
// npm deps
var request = require('request');
var io = require('socket.io');
var fs = require('fs');
var appRoot = require('app-root-path');
var eventStream = require('event-stream');
var jsonStream = require('JSONStream');
var chalk = require('chalk');
// lib deps
var CacheService = require('./CacheService.js');

// vars
var TrafficReport = require('../models/TrafficReport.js');
var options = {};
var url = 'http://api.sr.se/api/v2/traffic/messages?format=json&pagination=true&size=100&indent=true';
var trafficReportJSON = appRoot + '/public/json/traffic_data.json';

exports.requestData = function () {
    console.log(chalk.cyan('eames: ') + 'cacheHasExpired, new request.');
    request(url)
        .pipe(jsonStream.parse('messages'))
        .pipe(eventStream.map(function (data) {
            fs.writeFile(trafficReportJSON, JSON.stringify(data),  function(err) {
                if(err) {
                    console.log('overwriteTimestamp error: ' + err);
                }
            });
            data.forEach(function (incident) {
                var json = {
                    id: incident.id,
                    priority: incident.priority,
                    createddate: incident.createddate,
                    title: incident.title,
                    exactlocation: incident.exactlocation,
                    description: incident.description,
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                    category: incident.category,
                    subcategory: incident.subcategory
                };
                var report = new TrafficReport(json);
                report.save();
            });
        }));
    CacheService.overwriteTimeStamp();
};

exports.cacheHasExpired = CacheService.cacheHasExpired;

exports.loadJSON = function () {
    try {
        return require(trafficReportJSON);
    }
    catch (error) {
        console.log('loadJSON error: ' + error);
    }
};
