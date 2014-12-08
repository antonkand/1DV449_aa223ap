;(function () {
    'use strict';

angular.module('TrafficReportApp', ['TrafficMenuComponent', 'uiGmapgoogle-maps'])
    .controller('TrafficReportAppController', TrafficReportAppController);

function TrafficReportAppController($http, $scope) {
    var that = this;
    var infoWindow = null;
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
    this.map = {center: {latitude: 63, longitude: 17}, zoom: 4, bounds: {}};
    this.closeWindow = function (description) {
        //if (infoWindow) {
        //    infoWindow.close();
        //}
        console.log(description);
    };
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
              var hexColor = '';
              var category = '';
              // TODO make sure returned date is correct + contains dd
              var unixStringAsDateString = function (unixTimeStampString) {
                  var hourAsMs = 60*60*1000;
                  var strippedDate = parseInt(unixTimeStampString) + hourAsMs;
                  var date = new Date(strippedDate * 1000);
                  var hours = date.getHours();
                  var minutes = +'0' + date.getMinutes();
                  var seconds = +'0' + (date.getMilliseconds()/1000);
                  console.log(date.getHours());
                  console.log(date.getMinutes());
                  console.log((date.getMilliseconds() / 1000));
                  return hours + ':' + minutes + ':' + seconds;
              };
              var timestamp = unixStringAsDateString(marker.createddate.substring(6, marker.createddate.length-7));
              switch (marker.priority) {
                  case 1:
                      hexColor = '#F51329';
                      break;
                  case 2:
                      hexColor = '#F98020';
                      break;
                  case 3:
                      hexColor = '#F9EB18';
                      break;
                  case 4:
                      hexColor = '#85E0F7';
                      break;
                  case 5:
                      hexColor = '#85E0F7';
                      break;
              }
              switch (marker.category) {
                  case 0:
                      category = 'Vägtrafik';
                      break;
                  case 1:
                      category = 'Kollektivtrafik';
                      break;
                  case 2:
                      category = 'Planerad störning';
                      break;
                  case 3:
                      category = 'Övrigt';
                      break;
              }
              console.log(google.maps.InfoWindow);
              return {
                  id: (index + 12345),
                  title: marker.title,
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                  description: marker.description,
                  labelClass: hexColor,
                  markerPriorityColor: hexColor,
                  options: { animation: null, visible: true},
                  labelContent: marker.description,
                  show: false,
                  category: category,
                  categoryNumber: marker.category,
                  name: marker.name,
                  zoom: marker.zoom,
                  date: timestamp,
                  icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      strokeColor: hexColor,
                      strokeWeight: 0.8,
                      fillOpacity: 0.5,
                      fillColor: hexColor,
                      scale: 6
                  },
                  checkForOpenWindow: function () {
                      //if (google.maps.InfoWindow) {
                      //    google.maps.InfoWindow.close();
                      //}
                      return function () {
                        console.log(google.maps.InfoWindow);
                      };
                  }
              };
          });
      })
        .error(function (data, status, headers, config) {
            console.log('GET error');
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    console.log('TrafficReportAppController initialized.');
    }
})();