angular.module('TrafficReport', [
    'TrafficFilter',
    'ListingController',
    'ListingDirective',
    'ListingFactory',
    'uiGmapgoogle-maps'
    ])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
    .controller('TrafficReportMapController', function ($scope, uiGoogleMapApi) {
        uiGmapGoogleMapApi.then(function(maps) {

    });
});