var app = angular.module('leela.report', []);

app.factory('ReportService', function(){
	var createReport = function(game){
		circle_count = game.history.filter(function (item) {return item == 72}).length + 1;

		return {move_count: game.dices_history.length, circle_count: circle_count}
	}

	return {createReport : createReport};
});