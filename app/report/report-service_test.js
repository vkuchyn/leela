describe('report service ', function () {

    beforeEach(module('leela.report'));

    var ReportService, game;

    beforeEach(inject(function (_ReportService_) {
        ReportService = _ReportService_;
        game = {deposit:0,born:true,finished:true,history:[6,10,28,54],current_position:68,dices_history:[1,2,3,4,5,6,4,5,4]}
    }));

    it('should calculate mvoes count', function () {
    	report = ReportService.createReport(game);
    	expect(report.move_count).toBe(9);
    });

    it('should calculate circle count', function () {
    	report = ReportService.createReport(game);
    	expect(report.circle_count).toBe(1);
    });

    it('should calculate circle count', function () {
    	game.history.push(69);
    	game.history.push(72);
    	game.history.push(70);
    	game.history.push(72);
    	report = ReportService.createReport(game);
    	expect(report.circle_count).toBe(3);
    });
});    