var app = angular.module('leela.gameplay', ['leela.board']);

app.controller('GameplayController', function ($scope, board, GameService) {
    $scope.board = board;
    $scope.game = GameService.createNewGame(board.cosmic_cell);

    $scope.moveChip = function (steps) {
        checkStepOutOfRange(steps);
        checkGameIsFinished($scope.game.finished);
        if (!$scope.game.born) {
            if (steps == 6) {
                $scope.game.born = true;
                $scope.game.current_position = GameService.moveChipAndSaveHistory(6, $scope.game, $scope.board);
            }
        } else {
            if (steps == 6) {
                $scope.game.deposit += 6;
            } else {
                if ($scope.game.deposit % 18 == 0) {
                    $scope.game.deposit = 0;
                }
                var new_position = steps + $scope.game.deposit + $scope.game.current_position;
                $scope.game.deposit = 0;
                $scope.game.current_position = GameService.moveChipAndSaveHistory(new_position, $scope.game, $scope.board);
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

    $scope.startNewGame = function () {
        $scope.game = GameService.createNewGame(board.cosmic_cell);
    };

    $scope.showHistory = function () {
        return $scope.game.history;
    }

    $scope.undoLastMove = function () {
        GameService.undoLastMove($scope.game);
    }
});

app.factory('GameService', function () {
    var createNewGame = function (cosmic_cell) {
        return {deposit: 0, born: false, finished: false, history: new Array(), current_position: cosmic_cell};
    }

    var undoLastMove = function (game) {
        game.history.pop();
        if (game.history.length == 0) {
            game.born = false;
        }
        if (game.finished) {
            game.finished = false;
        }
    };


    var checkRedirect = function (position, board) {
        var cell = board.cells[position];
        if (!cell ){
            return position;
        }
        var goto = (cell.goto) ? cell.goto : position;
        return goto;
    };

    var moveChipAndSaveHistory = function (new_position, game, board) {
        if (new_position <= board.last_cell) {
            game.history.push(new_position);
            return checkRedirect(new_position, board);
        } else {
            return game.current_position;
        }
    };

    return {createNewGame: createNewGame, undoLastMove: undoLastMove, moveChipAndSaveHistory: moveChipAndSaveHistory};
});
