var app = angular.module('leela.gameplay', ['ngRoute', 'leela.board'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/gameplay', {
            templateUrl: 'gameplay/gameplay.html',
            controller: 'GameplayController',
        });
    }]);

app.controller('GameplayController', function ($scope, History, Board) {
    $scope.born = false;
    $scope.deposit = 0;
    var boardPromice = Board.getBoard();
    boardPromice.then(function (result) {
        $scope.board = result;
        $scope.current_position = $scope.board.space_cell;
    });
    $scope.moveChip = function (steps) {
        if (steps <= 0 || steps > 6) {
            throw new Error("Step must be between 1 and 6");
        }

        if (!$scope.born) {
            if (steps == 6) {
                $scope.born = true;
                $scope.current_position = moveChipAndSaveHistory(6, 0);
            }
        } else {
            if (steps == 6) {
                if ($scope.deposit == 12) {
                    $scope.deposit = 0;
                } else {
                    $scope.deposit += 6;
                }
            } else {
                steps += $scope.deposit;
                $scope.deposit = 0;
                $scope.current_position = moveChipAndSaveHistory(steps, $scope.current_position);
            }
        }
    };

    var checkArrow = function (position) {
        var arrows = $scope.board.arrows;
        for (var i in arrows) {
            if (arrows[i].from == position) {
                return arrows[i].to;
            }
        }
        return position;
    };

    moveChipAndSaveHistory = function (steps, current_position) {
        var new_position = current_position + steps;
        if (new_position <= $scope.board.last_cell) {
            History.push(new_position);
            new_position;
        } else {
            new_position = current_position;
        }
        var check_arrow = checkArrow(new_position);
        if (new_position != check_arrow) {
            return check_arrow;
        }
        return new_position;
    };
});

app.controller('HistoryController', function ($scope, History) {

    $scope.showHistory = function () {
        return History;
    }
});

app.factory('History', function () {
    return new Array();
})
