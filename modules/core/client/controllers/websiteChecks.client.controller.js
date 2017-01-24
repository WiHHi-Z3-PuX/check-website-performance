'use strict';

angular.module('core').controller('WebsiteChecksController', ['$scope', '$http', '$stateParams',
  function ($scope, $http, $stateParams) {
    if ($stateParams.url) {
      $scope.url = $stateParams.url;
      getWebsiteChecks();
    }
    
    function getWebsiteChecks () {
      $http.post('/websitechecks', { url: $scope.url })
        .then(function (res) {
            $scope.websiteChecks = res.data;

            $scope.resourcesList = generateResourcesList($scope.websiteChecks);
          },
          function (err) {
            $scope.error = err;
          }
        );
    }
    
    function generateResourcesList (websiteChecks) {
      var resources = {};
      
      for (var i = 0; i < websiteChecks.length; i++) {
        for (var j = 0; j < websiteChecks[i].resources.length; j++) {
          var resource = websiteChecks[i].resources[j];
          
          if (resources.hasOwnProperty(resource.path)) {
            if (resources[resource.path].slowestRequest < resource.time) {
              resources[resource.path].slowestRequest = resource.time;
            }

            if (resources[resource.path].fastestRequest > resource.time) {
              resources[resource.path].fastestRequest = resource.time;
            }

            if (resources[resource.path].maxLatency < resource.latency) {
              resources[resource.path].maxLatency = resource.latency;
            }

            if (resources[resource.path].minLatency > resource.latency) {
              resources[resource.path].minLatency = resource.latency;
            }
          } else {
            resources[resource.path] = {};
            resources[resource.path].slowestRequest = resource.time;
            resources[resource.path].fastestRequest = resource.time;
            resources[resource.path].maxLatency = resource.latency;
            resources[resource.path].minLatency = resource.latency;
            resources[resource.path].resourceType = resource.resourceType;
            resources[resource.path].size = resource.size;
          }
        }
      }
      
      return resources;
    }
  }
]);
