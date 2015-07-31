var app = angular.module('leela.gameplay', ['ngRoute', 'leela.board'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/gameplay', {
            templateUrl: 'gameplay/gameplay.html',
            controller: 'GameplayController'
        });
    }]);

app.controller('GameplayController', function ($scope, History, Board) {
    $scope.game = {deposit : 0, born:false};
    $scope.game.history = History;
    var boardPromice = Board.getBoard();
    boardPromice.then(function (result) {
        $scope.game.board = result;
        $scope.game.current_position = result.space_cell;
    });
    $scope.moveChip = function (steps) {
        checkStepOutOfRange(steps);
        if (!$scope.game.born) {
            if (steps == 6) {
                $scope.game.born = true;
                $scope.game.current_position = moveChipAndSaveHistory(6, 0);
            }
        } else {
            if (steps == 6) {
                $scope.game.deposit += 6;
            } else {
                if ($scope.game.deposit % 18 == 0) {
                    $scope.game.deposit = 0;
                }
                steps += $scope.game.deposit;
                $scope.game.deposit = 0;
                $scope.game.current_position = moveChipAndSaveHistory(steps, $scope.game.current_position);
            }
        }
    };

    var checkStepOutOfRange = function (steps) {
        if (steps <= 0 || steps > 6) {
            throw new Error("Step must be between 1 and 6");
        }
    }

    var checkArrow = function (position) {
        var arrows = $scope.game.board.arrows;
        for (var i in arrows) {
            if (arrows[i].from == position) {
                return arrows[i].to;
            }
        }
        return position;
    };

    moveChipAndSaveHistory = function (steps, current_position) {
        var new_position = current_position + steps;
        if (new_position <= $scope.game.board.last_cell) {
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

    $scope.showHistory = function () {
        return History;
    }
});

app.factory('History', function () {
    return new Array();
})
