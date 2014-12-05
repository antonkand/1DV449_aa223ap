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
    this.map = {center: {latitude: 63, longitude: 17}, zoom: 5, bounds: {}};
    this.displayInfo = function (description) {
        console.log(description);
    }
    $http.get('http://localhost:8080/traffic-data')
        .success(function (data, status, headers, config) {
            data.forEach(function (trafficmessage) {
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
            that.markers = that.messages.events.map(function (marker, index) {
                var cssClass = '';
                switch (marker.priority) {
                    case 1:
                        cssClass = 'danger';
                        break;
                    case 2:
                        cssClass = 'warning';
                        break;
                    case 3:
                        cssClass = 'info';
                        break;
                    case 4:
                        cssClass = 'default';
                        break;
                    case 5:
                        cssClass = 'success';
                        break;
                }
                return {
                    id: (index + 12345),
                    title: marker.title,
                    description: marker.description,
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    priorityColor: cssClass,
                    display: function () {
                        return that.displayInfo(marker.description);
                    }
                };
            });
            //console.table(that.messages.events);
            //console.table(that.markers);
        })
        .error(function (data, status, headers, config) {
            console.log('GET error');
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    console.log('TrafficReportAppController initialized.');
};