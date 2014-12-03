'use strict';
angular.module('TrafficReportApp', ['TrafficMenuComponent', 'uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
    .controller('TrafficReportAppController', TrafficReportAppController);

function TrafficReportAppController($http) {
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
    console.log('TrafficReportAppController initialized.');
    this.areas = ['ett', 'two'];
    this.events = ['ett', 'two'];
    this.categories = ['ett', 'two'];
    this.map = null;
    uiGmapGoogleMapApi.then(function(maps) {
        this.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

        console.log('uiGoogleMapApi');
    }).bind(this);
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