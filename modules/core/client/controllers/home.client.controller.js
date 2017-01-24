'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', 'Socket',
  function ($scope, Authentication, $http, Socket) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.website = '';
    $scope.querySent = false;
    $scope.queryDone = false;
    
    $scope.create = function () {
      console.log(this.website);

      $http.post('/website', {
        website: this.website
      })
      .then(function (res) {
        if (res.data.end === true) {
          $scope.queryDone = true;
        }
      },
      function (err) {
        $scope.error = err;
      });

      $scope.querySent = true;
    };
    
    $scope.linechartdata = [[]];
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
    
    $scope.totalRequests = 0;
    $scope.requestsByType = {};
    $scope.pieData = [];
    $scope.pieLabels = [];
    $scope.pieOptions = {
      legend: {
        display: true,
        position: 'bottom'
      }
    };
    $scope.slowestRequest = 0;
    $scope.fastestRequest = 99999999999999;
    $scope.totalSize = 0;
    $scope.totalTime = 0;
    $scope.order = '-time';
    
    function updateSlowestFastest (r) {
      if (r.time > $scope.slowestRequest) {
        $scope.slowestRequest = r.time;
      }
      if (r.time < $scope.fastestRequest) {
        $scope.fastestRequest = r.time;
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
    
    function updateTotalSize (r) {
      $scope.totalSize += r.size;
    }

    function updateTotalTime (r) {
      $scope.totalTime += r.time;
    }
    
    function updateAvgTime () {
      $scope.avgTime = ($scope.totalTime/$scope.totalRequests).toFixed(2);
    }

    $scope.reset = function () {
      $scope.slowestRequest = 0;
      $scope.fastestRequest = 99999999999999;
      $scope.totalSize = 0;
      $scope.totalTime = 0;
      $scope.order = '-time';
      $scope.totalRequests = 0;
      $scope.requestsByType = {};
      $scope.pieData = [];
      $scope.pieLabels = [];
      $scope.linechartdata = [[]];
      $scope.website = '';
      $scope.querySent = false;
      $scope.queryDone = false;
      $scope.messages = [];
    };
    
    //SOCKETS
    $scope.messages = [];
    $scope.order = '-time';
    $scope.setOrder = function (val) {
      $scope.order = val;
    };

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
      $scope.linechartdata[0].push(message.time);
      updateLabels();
      $scope.totalRequests += 1;
      $scope.requestsByType[message.resourceType] = ($scope.requestsByType[message.resourceType] || 0) + 1;
      updatePie();
      updateSlowestFastest(message);
      updateTotalSize(message);
      updateTotalTime(message);
      updateAvgTime();
    });
    

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);
