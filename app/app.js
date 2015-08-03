var app = angular.module('leela', ['ngRoute', 'leela.gameplay', 'leela.board']);


app.config(['$routeProvider', function ($routeProvider, BoardService) {
    $routeProvider.when('/play', {
        templateUrl: "app/gameplay/gameplay.html",
        controller: 'GameplayController',
        resolve: {
            board: function (BoardService) {
                return BoardService.getBoard();
            }
        }
    });
}])


