'use strict';
var mongoose = require('mongoose');
var TrafficReport = mongoose.Schema({
    id: Number,
    priority: Number,
    createddate: String,
    title: String,
    exactlocation: String,
    description: String,
    latitude: Number,
    longitude: Number,
    category: Number,
    subcategory: String
});

module.exports = mongoose.model('TrafficReport', TrafficReport);
