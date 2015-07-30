describe('GameplayController', function () {
    beforeEach(module('leela.gameplay'));
    beforeEach(module('leela.board'));

    var $controller, $scope;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $scope = {};
        var controller = $controller('GameplayController', {$scope: $scope});
        $scope.board = {last_cell: 72};
        $scope.current_position = 6;
        $scope.born = true;
    }));

    describe('$scope.moveChip', function () {

        it('moves chip from the initial state to new position', function () {
            $scope.moveChip(4);
            expect($scope.current_position).toBe(10);
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
            $scope.born = false;
            $scope.current_position = 68;
            $scope.moveChip(1);
            $scope.moveChip(2);
            $scope.moveChip(3);
            $scope.moveChip(4);
            $scope.moveChip(5);

            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
        })

        it('should add steps if 6', function () {
            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
            expect($scope.deposit).toBe(6);
            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
            expect($scope.deposit).toBe(12);
            $scope.moveChip(1);
            expect($scope.current_position).toBe(19);
            expect($scope.deposit).toBe(0);
        })

        it('should reset deposit if 6x3', function () {
            $scope.moveChip(6);
            $scope.moveChip(6);
            $scope.moveChip(6);
            expect($scope.deposit).toBe(0);
        })

        it('shouldn\'t move if out of board', function () {
            $scope.current_position = 69;
            $scope.moveChip(4);
            expect($scope.current_position).toBe(69);
            $scope.moveChip(2);
            expect($scope.current_position).toBe(71);
        })

        it('should move from 10 to 23 by arrow', function () {
            $scope.board.arrows = [{"from": 10, "to": 23}]
            $scope.moveChip(4);
            expect($scope.current_position).toBe(23);
        })

    })

    describe('$scope.showHistory', function () {
        it('store previous position after move in history', function () {
            var gamePlayScope = $scope;
            gamePlayScope.current_position = 1;
            gamePlayScope.moveChip(5);
            gamePlayScope.moveChip(5);

            var $historyScope = {};
            var historyController = $controller('HistoryController', {$scope: $historyScope});

            expect($historyScope.showHistory()).toEqual([6, 11]);
        });
    })
});