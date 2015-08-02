var app = angular.module('leela.gameplay', ['leela.board']);

app.controller('GameplayController', function ($scope, History, Board) {
    $scope.game = {deposit: 0, born: false};
    $scope.game.history = History;

    var boardPromice = Board.getBoard();
    boardPromice.then(function (result) {
        $scope.board = result;
        $scope.game.current_position = result.cosmic_cell;
    });

    $scope.moveChip = function (steps) {
        checkStepOutOfRange(steps);
        checkGameIsFinished($scope.game.finished);
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

            if ($scope.game.current_position == $scope.board.cosmic_cell) {
                $scope.game.finished = true;
            }
        }
    };

    var checkGameIsFinished = function (finished) {
        if (finished) {
            throw new Error("Cannot make a move when game finished");
        }
    }

    var checkStepOutOfRange = function (steps) {
        if (steps <= 0 || steps > 6) {
            throw new Error("Step must be between 1 and 6");
        }
    }

    var checkRedirect = function (position) {
        var cells = $scope.board.cells;
        for (var i in cells) {
            if (i == position) {
                var goto = (cells[i].goto) ? cells[i].goto : position;
                return goto;
            }
        }
        return position;
    };

    var moveChipAndSaveHistory = function (steps, current_position) {
        var new_position = current_position + steps;
        if (new_position <= $scope.board.last_cell) {
            History.push(new_position);
        } else {
            new_position = current_position;
        }
        var check_arrow = checkRedirect(new_position);
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
