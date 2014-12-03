app.directive('trafficMenu', function() {
    return {
        scope: {
            areas: '@',
            events: '@',
            categories: '@'
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/traffic-menu/traffic-menu-template.html',
        link: function(scope, elem, attrs) {
            console.log('trafficMenu directive');
        }
    };
});