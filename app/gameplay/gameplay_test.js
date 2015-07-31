describe('GameplayController', function () {
    beforeEach(module('leela.gameplay'));
    beforeEach(module('leela.board'));

    var $controller, $scope;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $scope = {};
        $controller('GameplayController', {$scope: $scope});
        $scope.game.board = {last_cell: 72};
        $scope.game.current_position = 6;
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
            $scope.game.board.cells = {"6": {"title": "moha"}};
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
            $scope.game.board.cells = {10: {"title": "tapah", goto: 23}};
            $scope.moveChip(4);
            expect($scope.game.current_position).toBe(23);
        });

        it('should move from 12 to 8 by snake', function () {
            $scope.game.board.cells = {12: {title: "eirshya", goto: 8}};
            $scope.game.current_position = 11;
            $scope.moveChip(1);
            expect($scope.game.current_position).toBe(8);
        });

    })

    describe('$scope.showHistory', function () {
        it('store previous position after move in history', function () {
            $scope.game.current_position = 1;
            $scope.moveChip(5);
            $scope.moveChip(5);

            expect($scope.showHistory()).toEqual([6, 11]);
        });

        it('save to history target cell when moving by arrow', function () {
            $scope.game.board.cells = {"10": {"title": "tapah", goto: 23}};
            $scope.game.current_position = 6;
            $scope.moveChip(4);
            $scope.moveChip(1);
            expect($scope.showHistory()).toEqual([10, 24]);
        });

        it('save to history target cell when moving by snake', function () {
            $scope.game.board.cells = {"12": {"title": "tapah", goto: 8}};
            $scope.game.current_position = 8;
            $scope.moveChip(4);
            $scope.moveChip(1);
            expect($scope.showHistory()).toEqual([12, 9]);
        });
    })
});