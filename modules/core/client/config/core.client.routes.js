'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('websites', {
      url: '/websites',
      templateUrl: 'modules/core/client/views/websites.client.view.html'
    })
    .state('websiteChecks', {
      url: '/websitechecks',
      templateUrl: 'modules/core/client/views/websiteChecks.client.view.html',
      params: { url: null }
    })
    .state('websiteCheck', {
      url: '/websitecheck',
      templateUrl: 'modules/core/client/views/websiteCheck.client.view.html',
      params: { _id: null }
    });
  }
]);
