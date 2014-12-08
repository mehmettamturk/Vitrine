'use strict';

var vitrine = angular.module("vitrine", ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

vitrine.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../partials/homepage.html',
            controller: 'HomepageController'
        }).
        otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);
