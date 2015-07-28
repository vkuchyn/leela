describe('GameplayController', function(){
    beforeEach(module('Leela'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('$scope.moveChip', function(){
        it('moves chip from the initial state to new position', function () {
            var $scope = {};
            var controller = $controller('GameplayController', {$scope: $scope});
            $scope.steps = 3;
            $scope.moveChip(4);
            expect($scope.current_position).toBe(10);
            expect($scope.steps).toBeNull();
        });

    })

    describe('$scope.showHistory', function(){
        it('store previous position after move in history', function(){
            var $gamePlayScope = {};
            var gameplayController = $controller('GameplayController', {$scope: $gamePlayScope});
            $gamePlayScope.moveChip(5);

            var $historyScope = {};
            var historyController = $controller('HistoryController', {$scope: $historyScope});

            expect($historyScope.showHistory()).toEqual([6, 11]);
        });
    })
});