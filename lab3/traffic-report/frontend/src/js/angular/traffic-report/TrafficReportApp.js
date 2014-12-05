'use strict';
angular.module('TrafficReportApp', ['TrafficMenuComponent', 'uiGmapgoogle-maps'])
    .controller('TrafficReportAppController', TrafficReportAppController);

function TrafficReportAppController($http, $scope) {
    var that = this;
    this.markers = [];
    this.messages = {
        areas: ['ett', 'two'],
        events: [],
        categories: [
            {
                title: 'one',
                events: ['ett', 'two']
            },
            {
                title: 'two',
                events: ['ett', 'two']
            }
        ]
    };
    this.map = { center: {latitude: 63, longitude: 17}, zoom: 5, bounds: {}};
    $http.get('http://localhost:8080/traffic-data')
        .success(function (data, status, headers, config) {
            data.forEach(function(trafficmessage) {
                return that.messages.events.push({
                    priority: trafficmessage.priority,
                    createddate: trafficmessage.createddate,
                    title: trafficmessage.title,
                    exactlocation: trafficmessage.exactlocation,
                    description: trafficmessage.description,
                    latitude: trafficmessage.latitude,
                    longitude: trafficmessage.longitude,
                    category: trafficmessage.category,
                    subcategory: trafficmessage.subcategory
                });
            });
            that.markers = that.messages.events.map(function(marker, index){
                    return {
                       id:  'trafficMarker' + (index+1).toString(),
                       coords: {
                           latitude: marker.latitude,
                           longitude: marker.longitude
                       }
                    };
            });
            console.table(that.messages.events);
            console.table(that.markers);
        })
        .error(function (data, status, headers, config) {
            console.log('GET error');
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    console.log('TrafficReportAppController initialized.');

    //this.map = { center: { latitude: 57.85508728027342, longitude: 12.01069164276123 }, zoom: 8 };
};