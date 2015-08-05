describe('GameplayController', function () {
    beforeEach(module('leela.gameplay'));
    beforeEach(module('leela.board'));

    var $controller, $scope, GameService, $localStorage;

    beforeEach(inject(function (_$controller_, _GameService_, _$localStorage_) {
        $controller = _$controller_;
        GameService = _GameService_;
        $localStorage = _$localStorage_;

        $scope = {};
        board = {last_cell: 72, cosmic_cell: 68, cells: {}};
        $controller('GameplayController', {$scope: $scope, board: board});
        $scope.game = GameService.createNewGame(6);
        $scope.game.born = true;
    }));

    describe('$scope.moveChip', function () {

        it('moves chip from the initial state to new position', function () {
            $scope.moveChip(4);
            expect($scope.game.current_position).toBe(10);
        });

        it('should thow error if step out of range [1-6]', function () {
            expect(function () {
                $scope.moveChip(0)
            }).toThrow();
            expect(function () {
                $scope.moveChip(7)
            }).toThrow();
        });

        it('should born only after 6', function () {
            $scope.board.cells = {"6": {"title": "moha"}};
            $scope.game.born = false;
            $scope.game.current_position = 68;
            $scope.moveChip(1);
            $scope.moveChip(2);
            $scope.moveChip(3);
            $scope.moveChip(4);
            $scope.moveChip(5);

            $scope.moveChip(6);
            expect($scope.game.current_position).toBe(6);
        });

        it('should add steps if 6', function () {
            $scope.moveChip(6);
            expect($scope.game.current_position).toBe(6);
            expect($scope.game.deposit).toBe(6);
            $scope.moveChip(6);
            expect($scope.game.current_position).toBe(6);
            expect($scope.game.deposit).toBe(12);
            $scope.moveChip(1);
            expect($scope.game.current_position).toBe(19);
            expect($scope.game.deposit).toBe(0);
        });

        it('should reset deposit if 6x3', function () {
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            expect($scope.game.deposit).toBe(18);
            $scope.moveChip(2);
            expect($scope.game.current_position).toBe(8);
        });

        it('should reset deposit if 6x6', function () {
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            expect($scope.game.deposit).toBe(36);
            $scope.moveChip(2);
            expect($scope.game.current_position).toBe(8);
        });

        it('shouldn\'t move if out of board', function () {
            $scope.game.current_position = 69;
            $scope.moveChip(4);
            expect($scope.game.current_position).toBe(69);
            $scope.moveChip(2);
            expect($scope.game.current_position).toBe(71);
        });

        it('should move from 10 to 23 by arrow', function () {
            $scope.board.cells = {10: {"title": "tapah", goto: 23}};
            $scope.moveChip(4);
            expect($scope.game.current_position).toBe(23);
        });

        it('should move from 12 to 8 by snake', function () {
            $scope.board.cells = {12: {title: "eirshya", goto: 8}};
            $scope.game.current_position = 11;
            $scope.moveChip(1);
            expect($scope.game.current_position).toBe(8);
        });

        it('should finish game when gets on 68', function () {
            $scope.game.current_position = 67;
            $scope.moveChip(1);
            expect($scope.game.current_position).toBe(68);
            expect($scope.game.finished).toBe(true);
        });

        it('expect error when try to make a move after game is finished', function () {
            $scope.game.finished = true;
            expect(function () {
                $scope.moveChip(1)
            }).toThrow();
        });

    });

    describe('game service ', function () {
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
            GameService.undoLastMove(game, $scope.board);
            expect(game.history).toEqual([]);
        });

        it('should undo last move', function () {
            var game = GameService.createNewGame(68);
            game.history = [1, 2, 3];
            GameService.undoLastMove(game, $scope.board);
            expect(game.history).toEqual([1, 2]);
        });

        it('should undo first move', function () {
            var game = GameService.createNewGame(6);
            game.born = true;
            game.history = [6];
            GameService.undoLastMove(game, $scope.board);
            expect(game.history).toEqual([]);
            expect(game.born).toBe(false);
            expect(game.current_position).toBe(68);
        });

        it('should set finished to false when game is finished', function () {
            var game = GameService.createNewGame(68);
            game.finished = true;
            game.history = [1, 2];
            GameService.undoLastMove(game, $scope.board);
            expect(game.finished).toBe(false);
        });

        it('should undo current position on undo move', function () {
            var game = GameService.createNewGame(68);
            game.history = [6, 9];
            GameService.undoLastMove(game, $scope.board);
            expect(game.current_position).toBe(6);
        });

        it('should undo current position to arrow on undo move', function () {
            var game = GameService.createNewGame(68);
            game.history = [6, 10, 24];
            $scope.board.cells = {10: {goto:23} }
            GameService.undoLastMove(game, $scope.board);
            expect(game.current_position).toBe(23);
        });
        //
        //it('should save game to local storage', function(){
        //    var game = GameService.createNewGame(5);
        //    GameService.saveGame(game);
        //    expect($localStorage.game).toEqual(game);
        //});

        it('should archive game after new game was created', function () {
            $localStorage.game = $scope.game;
            var game = GameService.createNewGame(68);
            expect($localStorage.game).toEqual(game);
            expect($localStorage.game_archive).toEqual([$scope.game]);
        });
    });

    describe('$scope.showHistory', function () {
        it('store previous position after move in history', function () {
            $scope.game.current_position = 1;
            $scope.moveChip(5);
            $scope.moveChip(5);

            expect($scope.showHistory()).toEqual([6, 11]);
        });

        it('save to history target cell when moving by arrow', function () {
            $scope.board.cells = {"10": {"title": "tapah", goto: 23}};
            $scope.game.current_position = 6;
            $scope.moveChip(4);
            $scope.moveChip(1);
            expect($scope.showHistory()).toEqual([10, 24]);
        });

        it('save to history target cell when moving by snake', function () {
            $scope.board.cells = {"12": {"title": "tapah", goto: 8}};
            $scope.game.current_position = 8;
            $scope.moveChip(4);
            $scope.moveChip(1);
            expect($scope.showHistory()).toEqual([12, 9]);
        });
    })
});