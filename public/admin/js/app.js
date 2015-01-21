'use strict';

var adminPanel = angular.module("adminPanel", ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

adminPanel.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/admin.html',
            controller: 'AdminController'
        }).
        when('/categories', {
            templateUrl: 'partials/categories.html',
            controller: 'AdminController'
        }).
        when('/products', {
            templateUrl: 'partials/products.html',
            controller: 'AdminController'
        }).
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'AdminController'
        }).
        when('/sales', {
            templateUrl: 'partials/sales.html',
            controller: 'AdminController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);
