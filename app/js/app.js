'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngTouch',
  'ngAnimate',
  'xeditable',
  'indexedDB'
  
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/add-expense', {
      templateUrl: 'partials/add-expense.html',
      controller: 'AddExpenseCtrl'
  });     
  $routeProvider.when('/view-summary', {
      templateUrl: 'partials/view-summary.html',
      controller: 'ViewSummaryCtrl'
  })
      .when('/view-summary/edit', {
          templateUrl: 'partials/add-expense.html',
          controller: 'AddExpenseCtrl'
      });
  $routeProvider.otherwise({
      redirectTo: '/'
  });
 }
 ]).config(function ($indexedDBProvider) {
    $indexedDBProvider
      .connection('myIndexedDB')
      .upgradeDatabase(1, function(event, db, tx){
        var objStore = db.createObjectStore('people', {keyPath: 'ssn'});
        objStore.createIndex('name_idx', 'name', {unique: false});
        objStore.createIndex('age_idx', 'age', {unique: false});
      });
  });

