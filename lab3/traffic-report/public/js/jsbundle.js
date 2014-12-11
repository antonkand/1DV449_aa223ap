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
    var attachEventListenersToSortMenu = (function() {
      var all = document.querySelector('#categories-all');
      all.addEventListener('click', (function() {
        $__0.markerReferences.forEach((function(marker) {
          marker.visible = true;
          console.log('all click');
        }));
      }), false);
      var transport = document.querySelector('#categories-transport');
      transport.addEventListener('click', (function() {
        $__0.markerReferences.forEach((function(marker) {
          if (marker.trafficCategory === 1) {
            marker.visible = true;
            console.log(marker);
            console.log('traffic click');
          } else {
            marker.visible = false;
          }
        }));
      }), false);
      var traffic = document.querySelector('#categories-traffic');
      traffic.addEventListener('click', (function() {
        $__0.markerReferences.forEach((function(marker) {
          if (marker.trafficCategory === 0) {
            marker.visible = true;
            console.log('traffic click');
          } else {
            marker.visible = false;
          }
        }));
      }), false);
      var other = document.querySelector('#categories-other');
      other.addEventListener('click', (function() {
        $__0.markerReferences.forEach((function(marker) {
          if (marker.trafficCategory === 3) {
            marker.visible = true;
            console.log('other click');
          } else {
            marker.visible = false;
          }
        }));
      }), false);
      var disturbance = document.querySelector('#categories-disturbance');
      disturbance.addEventListener('click', (function() {
        $__0.markerReferences.forEach((function(marker) {
          if (marker.trafficCategory === 2) {
            marker.visible = true;
            console.log('disturbance click');
          } else {
            marker.visible = false;
          }
        }));
      }), false);
    });
    var createInfoWindow = (function(marker) {
      var htmlString = '<div>' + '<h3>' + marker.title + '</h3>' + '<span>' + marker.category + ' ' + marker.date + '</span>' + '<p>' + marker.description + '</p>' + '</div>';
      var newWindow = new google.maps.InfoWindow({content: htmlString});
      return newWindow;
    });
    var pinMarker = (function(markerToAdd) {
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
    });
    var addMarkerToMenu = (function(marker) {
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
        var filtered = $__0.markerReferences.filter((function(element) {
          console.log(element.title);
          console.log(e.target.firstChild);
          return element.title === e.target.firstChild.toString();
        }));
        console.log(filtered);
        google.maps.event.trigger($__0.markerReferences[marker.id], 'click');
      }), false);
      span.appendChild(a);
      li.appendChild(span);
      ul.appendChild(li);
      ul.appendChild(divider);
    });
    var handleMarkers = (function(data) {
      $__0.markers = JSON.parse(data).map((function(marker, index) {
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
      })).sort((function(a, b) {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      })).forEach((function(marker) {
        pinMarker(marker);
        addMarkerToMenu(marker);
        attachEventListenersToSortMenu();
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
