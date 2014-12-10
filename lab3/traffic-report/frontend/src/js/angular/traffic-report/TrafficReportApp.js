;(function () {
'use strict';

angular.module('TrafficReportApp', ['TrafficMenuComponent', 'uiGmapgoogle-maps'])
    .controller('TrafficReportAppController', TrafficReportAppController);

function TrafficReportAppController($http, $scope) {
    var that = this;
    this.markers = [];
    this.infowindow = google.maps.InfoWindow;
    this.windowController = {};
    console.log(this.infowindow);
    this.activeWindow = null;
    this.map = {center: {latitude: 63, longitude: 17}, zoom: 4, bounds: {}};
    var handleWindow = function (e) {
        e = e || event;
        if (that.activeWindow) {
            that.activeWindow.setAnimation(null);
            that.activeWindow.visible = false; // TODO find where the directive have buried .close(), isDrawn removes object from map
        }
        that.activeWindow = e;
        that.activeWindow.setAnimation(google.maps.Animation.BOUNCE);
        //console.log(that.windowController.getGWindows());
        that.windowController.getChildWindows().get(that.activeWindow.key).hideWindow();
        console.log(that.windowController.getChildWindows().get(that.activeWindow.key).gWin.__e3_);
        //console.log(that.activeWindow.key);
        that.windowController.getChildWindows().values().forEach(function (window) {
            window.remove = true;
        });
        //that.windowController.getGWindows().forEach(function (window) {
        //    window.show = false;
        //});
    };
    $http.get('http://localhost:8080/traffic-data')
        .success(function (data, status, headers, config) {
          that.markers = data.map(function (marker, index) {
              var hexColor = '';
              var category = '';
              var timestamp = new Date(parseInt((marker.createddate.substring(6, marker.createddate.length-7)))).toLocaleString();
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
                      fillOpacity: 0.8,
                      fillColor: hexColor,
                      scale: 6
                  },
                  windowclick: handleWindow
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