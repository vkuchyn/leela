var app = angular.module('leela.board', []);

app.service('boardService', function(){
    var board = {title: "test title"};
    //$http.get('resources/game-board.json').then(function(res){
    //    board = res.data;
    //});

    return board;
})