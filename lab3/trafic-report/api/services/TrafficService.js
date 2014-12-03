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
var url = 'http://api.sr.se/api/v2/traffic/messages?format=json&pagination=true&size=100&indent=true';

exports.requestData = function (res, callback) {
    var received = [];
    console.log(chalk.cyan('traffic-data: ') + 'cacheHasExpired, new request.');
    request(url)
        .pipe(jsonStream.parse('messages'))
        .pipe(eventStream.map(function (data) {
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
                received.push(json);
                var report = new TrafficReport(json);
                report.save();
            });
            CacheService.overwriteTimeStamp();
            callback(res, received);
        }));
};
exports.cacheHasExpired = CacheService.cacheHasExpired;
