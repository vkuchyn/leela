var app = angular.module('Leela', []);

app.controller('GameplayController', function ($scope, History) {
    $scope.current_position = 68;
    $scope.born = false;
    $scope.moveChip = function (steps) {
        if (steps <= 0 || steps > 6) {
            throw new Error("Step must be between 1 and 6");
        }

        if (!$scope.born ) {
            if (steps == 6){
                $scope.born = true;
                $scope.current_position = moveChipAndSaveHistory(6, 0);
            }
        } else {
            $scope.current_position = moveChipAndSaveHistory(steps, $scope.current_position);
        }
    };

    moveChipAndSaveHistory = function (steps, current_position){
        current_position += steps
        History.push(current_position);
        return current_position;
    };
});

app.controller('HistoryController', function ($scope, History) {

    $scope.showHistory = function (){
        return History;
    }
});

app.factory('History', function(){
    return new Array();
})