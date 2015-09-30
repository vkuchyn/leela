var app = angular.module('leela.board', []);

app.factory('BoardService', function ($http) {

    var getBoard = function () {
        return $http.get('/Leela/resources/game-board.json').then(function (result) {
            return result.data;
        }, function (data, status, headers, config) {
            throw new Error("Cannot load board. Check internet connection");
        });
    }

    return {getBoard: getBoard};
})
