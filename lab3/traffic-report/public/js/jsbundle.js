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
    this.markerReferences = [];
    var clear = (function() {
      $__0.markerReferences.forEach((function(marker) {
        marker.setMap(null);
      }));
    });
    var addSpecificMarkers = (function(filteredArray) {
      filteredArray.forEach((function(marker) {
        marker.setMap($__0.map);
      }));
    });
    var attachEventListenersToSortMenu = (function() {
      var all = document.querySelector('#categories-all');
      var transport = document.querySelector('#categories-transport');
      var traffic = document.querySelector('#categories-traffic');
      var disturbance = document.querySelector('#categories-disturbance');
      var other = document.querySelector('#categories-other');
      all.addEventListener('click', (function() {
        clear();
        addSpecificMarkers($__0.markerReferences);
      }), false);
      traffic.addEventListener('click', (function() {
        clear();
        addSpecificMarkers($__0.markerReferences.filter((function(marker) {
          return marker.trafficCategory === 0;
        })));
      }), false);
      transport.addEventListener('click', (function() {
        clear();
        addSpecificMarkers($__0.markerReferences.filter((function(marker) {
          return marker.trafficCategory === 1;
        })));
      }), false);
      disturbance.addEventListener('click', (function() {
        clear();
        addSpecificMarkers($__0.markerReferences.filter((function(marker) {
          return marker.trafficCategory === 2;
        })));
      }), false);
      other.addEventListener('click', (function() {
        clear();
        addSpecificMarkers($__0.markerReferences.filter((function(marker) {
          return marker.trafficCategory === 3;
        })));
      }), false);
    });
    var createInfoWindow = (function(marker) {
      var htmlString = '<div>' + '<h3>' + marker.title + '</h3>' + '<span>' + marker.category + ' ' + marker.date + '</span>' + '<p>' + marker.description + '</p>' + '</div>';
      var newWindow = new google.maps.InfoWindow({content: htmlString});
      return newWindow;
    });
    var pinMarker = (function(markerToAdd, callback) {
      var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + markerToAdd.markerPriorityColor, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
      var info = createInfoWindow(markerToAdd);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerToAdd.latitude, markerToAdd.longitude),
        title: markerToAdd.title,
        animation: google.maps.Animation.DROP,
        map: $__0.map,
        icon: pinImage,
        trafficId: markerToAdd.id,
        trafficCategory: markerToAdd.categoryNumber
      });
      console.log('markerToAdd.id, inside pinMarker');
      console.log(markerToAdd.id);
      google.maps.event.addListener(marker, 'click', (function() {
        if (activeMarker) {
          activeMarker.setAnimation(null);
          infoWindow.close();
        }
        activeMarker = marker;
        infoWindow = info;
        infoWindow.open($__0.map, activeMarker);
        activeMarker.setAnimation(google.maps.Animation.BOUNCE);
      }));
      $__0.markerReferences.push(marker);
      callback();
    });
    var addMarkerToMenu = (function(marker) {
      console.log('addMarkerToMenu marker.id');
      console.log(marker.id);
      var ul = document.querySelector('#traffic-events');
      var li = document.createElement('li');
      var divider = document.createElement('li');
      divider.setAttribute('class', 'divider');
      var a = document.createElement('a');
      a.setAttribute('data-toggle', 'tab');
      a.innerHTML = '<strong>' + marker.date + '</strong> ' + '<br><em>' + marker.title + '</em>';
      var span = document.createElement('span');
      span.setAttribute('style', 'display: block;');
      span.setAttribute('id', 'marker' + marker.id);
      span.setAttribute('class', 'text-center');
      span.addEventListener('click', (function(e) {
        e = e || event;
        console.log('addMarkerToMenu, inside eventlistener, marker.id');
        console.log(marker.id);
        google.maps.event.trigger($__0.markerReferences[marker.id], 'click');
      }), false);
      span.appendChild(a);
      li.appendChild(span);
      ul.appendChild(li);
      ul.appendChild(divider);
    });
    var handleMarkers = (function(data) {
      $__0.markers = JSON.parse(data).sort((function(a, b) {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      })).map((function(marker, index) {
        var hexColor = '';
        var category = '';
        var timestamp = new Date((+marker.createddate.substring(6, marker.createddate.length - 7))).toLocaleString();
        switch (marker.priority) {
          case 1:
            hexColor = 'F51329';
            break;
          case 2:
            hexColor = 'F98020';
            break;
          case 3:
            hexColor = 'F9EB18';
            break;
          case 4:
            hexColor = '85E0F7';
            break;
          case 5:
            hexColor = '85E0F7';
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
          markerPriorityColor: hexColor,
          category: category,
          categoryNumber: marker.category,
          name: marker.name,
          zoom: marker.zoom,
          date: timestamp
        };
      })).forEach((function(marker) {
        pinMarker(marker, attachEventListenersToSortMenu);
        addMarkerToMenu(marker);
      }));
      console.table($__0.markerReferences);
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
      $__0.get('http://localhost:8080/traffic-data', handleMarkers);
    });
  }
  var run = (function() {
    console.log('TrafficReport ES6.');
    var controller = new TrafficReportController();
    controller.init();
  });
  google.maps.event.addDomListener(window, 'load', run);
})();
