(function () {
    'use strict';
    angular.module('TrafficMenuComponent', [])
      .directive('trafficMenu', function () {
          return {
              scope: {
                  messages: '=',
                  windowController: '='
              },
              restrict: 'E',
              replace: false,
              templateUrl: 'js/angulartemplates/components/traffic-menu/traffic-menu-template.html',
              link: function (scope, elem, attrs) {
                  console.log('trafficMenu directive');
              }
          };
      })
      .controller('TrafficMenuController', TrafficMenuController);
      function TrafficMenuController() {
            console.log('TrafficMenuController');
      }
})();

