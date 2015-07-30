describe('GameplayController', function () {
    beforeEach(module('leela.gameplay'));
    beforeEach(module('leela.board'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('$scope.moveChip', function () {
        it('moves chip from the initial state to new position', function () {
            var $scope = {};
            var controller = $controller('GameplayController', {$scope: $scope});
            $scope.current_position = 6;
            $scope.born = true;
            $scope.moveChip(4);
            expect($scope.current_position).toBe(10);
        });

        it('should thow error if step out of range [1-6]', function () {
            var $scope = {};
            var controller = $controller('GameplayController', {$scope: $scope});
            expect(function () {
                $scope.moveChip(0)
            }).toThrow();
            expect(function () {
                $scope.moveChip(7)
            }).toThrow();
        });

        it('should born only after 6', function () {
            var $scope = {};
            var controller = $controller('GameplayController', {$scope: $scope});

            $scope.moveChip(1);
            $scope.moveChip(2);
            $scope.moveChip(3);
            $scope.moveChip(4);
            $scope.moveChip(5);

            expect($scope.current_position).toBe(68);

            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
        })

        it('should add steps if 6', function () {
            var $scope = {};
            var controller = $controller('GameplayController', {$scope: $scope});
            $scope.current_position = 6;
            $scope.born = true;
            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
            $scope.moveChip(6);
            expect($scope.current_position).toBe(6);
            $scope.moveChip(1);
            expect($scope.current_position).toBe(19);
        })

    })

    describe('$scope.showHistory', function () {
        it('store previous position after move in history', function () {
            var $gamePlayScope = {};
            var gameplayController = $controller('GameplayController', {$scope: $gamePlayScope});
            $gamePlayScope.current_position = 1;
            $gamePlayScope.born = true;
            $gamePlayScope.moveChip(5);
            $gamePlayScope.moveChip(5);

            var $historyScope = {};
            var historyController = $controller('HistoryController', {$scope: $historyScope});

            expect($historyScope.showHistory()).toEqual([6, 11]);
        });
    })
});