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
    var infoWindow = null;
    var activeMarker = null;
    this.map = {};
    this.mapOptions = {};
    this.markers = [];
    var createInfoWindow = (function(marker) {
      var htmlString = '<div>' + '<h3>' + marker.title + '</h3>' + '<span>' + marker.category + ' ' + marker.date + '</span>' + '<p>' + marker.labelContent + '</p>' + '</div>';
      var newWindow = new google.maps.InfoWindow({content: htmlString});
      infoWindow = newWindow;
      return newWindow;
    });
    var pinMarker = (function(markerToAdd) {
      console.log(markerToAdd);
      var info = createInfoWindow(markerToAdd);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerToAdd.latitude, markerToAdd.longitude),
        title: markerToAdd.title,
        animation: google.maps.Animation.DROP,
        map: $__0.map
      });
      google.maps.event.addListener(marker, 'click', (function() {
        if (activeMarker) {
          activeMarker.setAnimation(null);
        }
        activeMarker = marker;
        if (infoWindow !== info) {
          infoWindow.close();
        }
        info.open($__0.map, activeMarker);
        activeMarker.setAnimation(google.maps.Animation.BOUNCE);
      }));
    });
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
          id: index,
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
      })).forEach(function(marker) {
        pinMarker(marker);
      });
    });
    this.init = (function() {
      $__0.mapOptions = {
        center: {
          lat: 56.6874601,
          lng: 16.326955
        },
        zoom: 5
      };
      $__0.map = new google.maps.Map(document.querySelector('#google-map-container'), $__0.mapOptions);
      $__0.get('http://localhost:8080/traffic-data', mapMarkers);
    });
  }
  console.log('TrafficReport ES6.');
  var run = (function() {
    var controller = new TrafficReportController();
    controller.init();
  });
  google.maps.event.addDomListener(window, 'load', run);
})();
