angular.module('main').
	directive('individual', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/individual.html',
			scope: {
				indi: '=data'
			}
		};
	}]);