var app = angular.module('leela.gameplay', ['ngStorage']);

app.controller('GameplayController', function ($scope, $localStorage, board, GameService) {
    $scope.board = board;
    $scope.game = GameService.loadGame(board);

    $scope.moveChip = function (steps) {
        checkStepOutOfRange(steps);
        checkGameIsFinished($scope.game.finished);
        addDiceToHistory($scope.game, steps);
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

    var addDiceToHistory = function(game, step){
        game.dices_history.push(step);
    }

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
        GameService.undoLastMove($scope.game, board);
    }

    $scope.loadGameFromStarage = function () {
        return $localStorage.game;
    };

    $scope.loadGameArchiveFromStarage = function () {
        return $localStorage.game_archive;
    };

    $scope.clearStorage = function () {
        delete $localStorage.game_archive;
        delete $localStorage.game;
    };

    $scope.saveToFile = function () {
        var data = {game: $localStorage.game, game_archive: $localStorage.game_archive};
        var BB = window.Blob;
        saveAs(
            new BB(
                [JSON.stringify(data)]
                , {type: "text/plain;charset=" + document.characterSet}
            )
            , 'leela.json');
    }

});

app.factory('GameService', ['$localStorage', function ($localStorage) {
    var createNewGame = function (cosmic_cell) {
        var newGame = {deposit: 0, born: false, finished: false, history: [], current_position: cosmic_cell,
            dices_history: []};
        var oldGame = $localStorage.game;
        if ($localStorage.game_archive == undefined) {
            if (oldGame) {
                $localStorage.game_archive = [oldGame];
            }
        } else {
            $localStorage.game_archive.push(oldGame);
        }

        $localStorage.game = newGame;
        return newGame;
    }

    var loadGame = function (board) {
        var game = $localStorage.game;
        if (!game) {
            game = createNewGame(board.cosmic_cell);
        }
        return game;
    }

    var undoLastMove = function (game, board) {
        game.history.pop();
        if (game.history.length == 0) {
            game.born = false;
            game.current_position = board.cosmic_cell;
        } else {
            if (game.finished) {
                game.finished = false;
            }
            game.current_position = checkRedirect(game.history[game.history.length - 1], board);
        }
    };

    var checkRedirect = function (position, board) {
        var cell = board.cells[position];
        if (!cell) {
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

    return {
        createNewGame: createNewGame, undoLastMove: undoLastMove, moveChipAndSaveHistory: moveChipAndSaveHistory,
        loadGame: loadGame
    };
}]);
