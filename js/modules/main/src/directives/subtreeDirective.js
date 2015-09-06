angular.module('main').
	directive('subtree', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/subtree.html',
			controller: ['$scope', 'langManager', function($scope, langManager) {
				Object.defineProperty($scope, 'lang', {
					get: function() {
						return langManager.lang;
					}
				});
			}],
			scope: {
				individual : '='
			}
		};
	}]);