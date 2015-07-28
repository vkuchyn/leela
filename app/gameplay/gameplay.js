var app = angular.module('Leela', []);

app.controller('GameplayController', function ($scope, History) {
    $scope.current_position = 6;
    History.push($scope.current_position);
    $scope.moveChip = function(steps) {
        $scope.current_position += steps;
        $scope.steps = null;
        History.push($scope.current_position);
    }
});

app.controller('HistoryController', function ($scope, History) {

    $scope.showHistory = function (){
        return History;
    }
});

app.factory('History', function(){
    return new Array();
})