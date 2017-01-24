'use strict';

angular.module('core').controller('WebsiteCheckController', ['$scope', '$http', '$stateParams',
  function ($scope, $http, $stateParams) {
    if ($stateParams._id) {
      $scope._id = $stateParams._id;
      getWebsiteCheck();
    }

    $scope.order = '-time';
    $scope.setOrder = function (val) {
      $scope.order = val;
    };

    function getWebsiteCheck () {
      $http.post('/websitecheck', { _id: $scope._id })
        .then(function (res) {
            $scope.websiteCheck = res.data;


            $scope.linechartdata = $scope.websiteCheck.resources.map(function (elm) {
              return elm.time;
            });

            $scope.linechartdata = [$scope.linechartdata];
            updateRequestsByType();
            updatePie();
            updateLabels();
          },
          function (err) {
            $scope.error = err;
          }
        );
    }

    $scope.requestsByType = {};

    function updateRequestsByType () {
      for (var i = 0; i < $scope.websiteCheck.resources.length; i++) {
        var message = $scope.websiteCheck.resources[i];
        $scope.requestsByType[message.resourceType] = ($scope.requestsByType[message.resourceType] || 0) + 1;
      }

    }

    function updatePie () {
      $scope.pieData = [];
      $scope.pieLabels = [];
      var keys = Object.keys($scope.requestsByType);
      for (var i = 0; i < keys.length; i++) {
        $scope.pieLabels.push(keys[i]);
        $scope.pieData.push($scope.requestsByType[keys[i]]);
      }
    }

    function updateLabels () {
      $scope.linechartlabels = Array.apply(null, new Array($scope.linechartdata[0].length)).map(function (_, i) {return i;});
    }

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];

    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              beginAtZero:true
            }
          }
        ]
      }
    };

    $scope.pieOptions = {
      legend: {
        display: true,
        position: 'bottom'
      }
    };
  }
]);
