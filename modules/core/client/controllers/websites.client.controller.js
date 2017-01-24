'use strict';

angular.module('core').controller('WebsitesController', ['$scope', '$http',
  function ($scope, $http) {
    function getWebsites () {
      $http.post('/websites', {})
        .then(function (res) {
            $scope.websites = res.data;
          },
          function (err) {
            $scope.error = err;
          }
        );
    }

    getWebsites();

  }
]);
