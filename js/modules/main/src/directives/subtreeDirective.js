angular.module('main').
	directive('subtree', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/subtree.html',
			scope: {
				individual : '='
			}
		};
	}]);