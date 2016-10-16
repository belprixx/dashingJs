'use strict';

angular.module('dashingApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: '/views/dashbord.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', function($scope, config) {
  $scope.items = config.items;
});