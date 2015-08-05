/**
 * Created by viktor on 8/5/15.
 */

describe('game service ', function () {

    beforeEach(module('leela.gameplay'));

    var $scope, GameService, $localStorage, board;

    beforeEach(inject(function (_GameService_, _$localStorage_) {
        GameService = _GameService_;
        $localStorage = _$localStorage_;

        $localStorage.game = undefined;
        $localStorage.game_archive = undefined;
        board = {last_cell: 72, cosmic_cell: 68, cells: {}};
    }));

    it('should generate new game', function () {
        var newGame = GameService.createNewGame(123);
        expect(newGame.deposit).toBe(0);
        expect(newGame.born).toBe(false);
        expect(newGame.finished).toBe(false);
        expect(newGame.history).toEqual([]);
        expect(newGame.current_position).toBe(123);
    });

    it('should undo last move for empty array', function () {
        var game = GameService.createNewGame(68);
        GameService.undoLastMove(game, board);
        expect(game.history).toEqual([]);
    });

    it('should undo last move', function () {
        var game = GameService.createNewGame(68);
        game.history = [1, 2, 3];
        GameService.undoLastMove(game, board);
        expect(game.history).toEqual([1, 2]);
    });

    it('should undo first move', function () {
        var game = GameService.createNewGame(6);
        game.born = true;
        game.history = [6];
        GameService.undoLastMove(game, board);
        expect(game.history).toEqual([]);
        expect(game.born).toBe(false);
        expect(game.current_position).toBe(68);
    });

    it('should set finished to false when game is finished', function () {
        var game = GameService.createNewGame(68);
        game.finished = true;
        game.history = [1, 2];
        GameService.undoLastMove(game, board);
        expect(game.finished).toBe(false);
    });

    it('should undo current position on undo move', function () {
        var game = GameService.createNewGame(68);
        game.history = [6, 9];
        GameService.undoLastMove(game, board);
        expect(game.current_position).toBe(6);
    });

    it('should undo current position to arrow on undo move', function () {
        var game = GameService.createNewGame(68);
        game.history = [6, 10, 24];
        board.cells = {10: {goto: 23}}
        GameService.undoLastMove(game, board);
        expect(game.current_position).toBe(23);
    });

    it('should archive game after new game was created', function () {
        var oldGame = {born: true, finished: false, current_position: 10, history: [6]};
        $localStorage.game = oldGame;
        var game = GameService.createNewGame(68);
        expect($localStorage.game).toEqual(game);
        expect($localStorage.game_archive).toEqual([oldGame]);
    });

    it('should add another game to archive after new game was created', function () {
        var game1 = {born: true, finished: false, current_position: 10, history: [6]};
        $localStorage.game = game1;
        var game2 = GameService.createNewGame(24);
        GameService.createNewGame(25);
        expect($localStorage.game_archive).toEqual([game1, game2]);
    });

    it('should load game from storage', function () {
        var game = {born: true, finished: false, deposit: 0, current_position: 6, history: []};
        $localStorage.game = game;
        var loadedGame = GameService.loadGame(board);
        expect(loadedGame).toEqual(game);
    });

    it('should create new game if storage is empty', function () {
        var loadedGame = GameService.loadGame(board);
        expect(loadedGame.current_position).toBe(68);
    });

});
