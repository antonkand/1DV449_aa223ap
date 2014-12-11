;(function () {
  'use strict';
  /*global google*/
  function TrafficReportController () {
    this.get = (url, callback) => {
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      console.log('get');
      xhr.addEventListener('load', () => {
        if (xhr.status < 400) {
          console.log('xhr ok.');
          callback(xhr.responseText);
        }
      });
      xhr.send(null);
    };
    let infoWindow = null;
    let activeMarker = null;
    this.map = {}; // sets on init
    this.mapOptions = {}; // sets on init
    this.markers = [];
    this.markerReferences = [];
    let clear = () => {
        infoWindow ? infoWindow.close() : null;
        this.markerReferences.forEach((marker) => {
          marker.setMap(null);
        });
      };
    let addSpecificMarkers = (filteredArray) => {
        filteredArray.forEach((marker) => {
          marker.setMap(this.map);
        });
    };
    let attachEventListenersToSortMenu = () => {
      let all = document.querySelector('#categories-all');
      let transport = document.querySelector('#categories-transport');
      let traffic = document.querySelector('#categories-traffic');
      let disturbance = document.querySelector('#categories-disturbance');
      let other = document.querySelector('#categories-other');
      all.addEventListener('click', () => {
        clear();
        addSpecificMarkers(this.markerReferences);
      }, false);
      traffic.addEventListener('click', () => {
        clear();
        addSpecificMarkers(this.markerReferences.filter((marker) =>  marker.trafficCategory === 0));
      }, false);
      transport.addEventListener('click', () => {
        clear();
        addSpecificMarkers(this.markerReferences.filter((marker) =>  marker.trafficCategory === 1));
      }, false);
      disturbance.addEventListener('click', () => {
        clear();
        addSpecificMarkers(this.markerReferences.filter((marker) =>  marker.trafficCategory === 2));
      }, false);
      other.addEventListener('click', () => {
        clear();
        addSpecificMarkers(this.markerReferences.filter((marker) =>  marker.trafficCategory === 3));
      }, false);
    };
    let createInfoWindow = (marker) => {
      let htmlString = '<div>' +
                       '<h3>' + marker.title + '</h3>' +
                       '<span>' + marker.category + ' ' + marker.date + '</span>' +
                       '<p>' + marker.description + '</p>' +
                       '</div>';
      let newWindow = new google.maps.InfoWindow({
        content: htmlString
      });
      return newWindow;
    };
    let pinMarker = (markerToAdd, callback) => {
        // tutorial custom colored markers:
        // http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
        let pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + markerToAdd.markerPriorityColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));
        let info = createInfoWindow(markerToAdd);
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerToAdd.latitude, markerToAdd.longitude),
          title: markerToAdd.title,
          animation: google.maps.Animation.DROP,
          map: this.map,
          icon: pinImage,
          trafficId: markerToAdd.id,
          trafficCategory: markerToAdd.categoryNumber
        });
      console.log('markerToAdd.id, inside pinMarker');
      console.log(markerToAdd.id);
        google.maps.event.addListener(marker, 'click', () => {
          if (activeMarker) {
            activeMarker.setAnimation(null);
            infoWindow.close();
          }
          activeMarker = marker;
          infoWindow = info;
          infoWindow.open(this.map, activeMarker);
          activeMarker.setAnimation(google.maps.Animation.BOUNCE);
        });
        this.markerReferences.push(marker);
        callback();
    };
    let addMarkerToMenu = (marker) => {
      console.log('addMarkerToMenu marker.id');
      console.log(marker.id);
      let ul = document.querySelector('#traffic-events');
      let li = document.createElement('li');
      let divider = document.createElement('li');
      divider.setAttribute('class', 'divider');
      let a = document.createElement('a');
      a.setAttribute('data-toggle', 'tab');
      a.innerHTML = '<strong>' + marker.date + '</strong> ' + '<br><em>' + marker.title + '</em>';
      let span = document.createElement('span');
      span.setAttribute('style', 'display: block;');
      span.setAttribute('id', 'marker'+ marker.id);
      span.setAttribute('class', 'text-center');
      span.addEventListener('click', (e) => {
        e = e || event;
        console.log('addMarkerToMenu, inside eventlistener, marker.id');
        console.log(marker.id);

        //console.log(filtered);
        google.maps.event.trigger(this.markerReferences[marker.id], 'click');
        //console.log(e.target.firstChild);
      }, false);
      span.appendChild(a);
      li.appendChild(span);
      ul.appendChild(li);
      ul.appendChild(divider);
    };
    let handleMarkers = (data) => {
      this.markers = JSON.parse(data).sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      }).map((marker, index) => {
        let hexColor = '';
        let category = '';
        let timestamp = new Date((+marker.createddate.substring(6, marker.createddate.length-7))).toLocaleString();
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
      }).forEach((marker) => {
          pinMarker(marker, attachEventListenersToSortMenu);
          addMarkerToMenu(marker);
      });
      //this.markerReferences.reverse();
      console.table(this.markerReferences);
    };
    this.init = () => {
      this.mapOptions = {
        center: { lat: 56.6874601, lng: 16.326955},
        zoom: 5
      };
      this.map = new google.maps.Map(document.querySelector('#google-map-container'), this.mapOptions);
      this.get('http://localhost:8080/traffic-data', handleMarkers);
    };
  }
  let run = () => {
    console.log('TrafficReport ES6.');
    let controller = new TrafficReportController();
    controller.init();
  };
  google.maps.event.addDomListener(window, 'load', run);
})();