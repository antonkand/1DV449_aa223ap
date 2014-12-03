'use strict';
var app = angular.module('TrafficReportApp', ['TrafficMenuComponent']);
app.controller('TrafficReportAppController', TrafficReportAppController);

function TrafficReportAppController($http) {
    console.log('TrafficReportAppController initialized.');
    this.areas = ['ett', 'two'];
    this.events = ['ett', 'two'];
    this.categories = ['ett', 'two'];
    $http.get('http://localhost:8080/traffic-data')
        .success(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        })
        .error(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
};


//.config(function(uiGmapGoogleMapApiProvider) {
//    uiGmapGoogleMapApiProvider.configure({
//        //    key: 'your api key',
//        v: '3.17',
//        libraries: 'weather,geometry,visualization'
//    });
//})
//function (uiGoogleMapApi) {
//    uiGmapGoogleMapApi.then(function(maps) {
//    });