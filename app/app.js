var app = angular.module('leela', ['ngRoute', 'leela.gameplay', 'leela.board']);
var leela_gameplay_module = angular.module('leela.gameplay', []);
var leela_board_module = angular.module('leela.board', []);

app.config(['$routeProvider', function ($routeProvider){
    $routeProvider.otherwise({redirectTo:'/gameplay'})
}])

