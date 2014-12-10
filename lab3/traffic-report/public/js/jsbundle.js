"use strict";
;
(function() {
  'use strict';
  function TrafficReportController() {
    var $__0 = this;
    this.get = (function(url, callback) {
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      console.log('get');
      xhr.addEventListener('load', (function() {
        if (xhr.status < 400) {
          console.log('xhr ok.');
          callback(xhr.responseText);
        }
      }));
      xhr.send(null);
    });
    this.markers = [];
    var mapMarkers = (function(data) {
      $__0.markers = JSON.parse(data).map((function(marker, index) {
        var hexColor = '';
        var category = '';
        var timestamp = new Date(parseInt((marker.createddate.substring(6, marker.createddate.length - 7)))).toLocaleString();
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
          options: {
            animation: null,
            visible: true
          },
          labelContent: marker.description,
          category: category,
          categoryNumber: marker.category,
          name: marker.name,
          zoom: marker.zoom,
          date: timestamp
        };
      }));
      console.log($__0.markers);
    });
    this.get('http://localhost:8080/traffic-data', mapMarkers);
  }
  console.log('TrafficReport ES6.');
  var run = (function() {
    return new TrafficReportController();
  });
  window.onload = run;
})();
