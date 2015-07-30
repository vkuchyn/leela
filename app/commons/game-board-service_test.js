"use strict";

describe("Test load board from json", function () {

    describe("Board service", function () {

        var boardServiceGetter

        beforeEach(inject(function () {
            var injector = angular.injector(['ng', 'leela.board']);
            boardServiceGetter = function () {
                return injector.get( 'boardService');
            }
        }));

        it('should contain a searchService', function () {
            boardServiceGetter();
        });

    });
});