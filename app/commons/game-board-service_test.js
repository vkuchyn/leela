"use strict";

describe("Test load board from json", function () {

    beforeEach(module('leela.board'));

    describe("Board service", function () {

        var boardServiceGetter, $httpBackend

        beforeEach(inject(function ($injector, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', '/Leela/resources/game-board.json').respond({"space_cell": 68, "delusion_cell": 6});
            boardServiceGetter = function () {
                return $injector.get('BoardService');
            }
        }));

        it('should contain space cell and delusion cell', function () {
            $httpBackend.expectGET('/Leela/resources/game-board.json');
            var promise = boardServiceGetter().getBoard();
            promise.then(function(result) {
                expect(result.space_cell).toBe(68);
                expect(result.delusion_cell).toBe(6);
            })
            $httpBackend.flush();
        });

    });
});