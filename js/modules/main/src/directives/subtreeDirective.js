angular.module('main').
	directive('subtree', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/subtree.html',
			scope: true,
			link: function(scope, element, attrs) {
				Object.defineProperty(scope, 'indi', {
					get: function() {
						return scope.ftreesCtrl.selected_individual;
					}
				});
			}
		};
	}]);