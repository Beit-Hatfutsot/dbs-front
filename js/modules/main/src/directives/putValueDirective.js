angular.module('main').
	directive('putValue', [function() {
		return {
			restrict: 'E',
			template: '<span>{{value}}</span>',
			scope: {
				value: '='
			},
			link: function(scope, element, attrs) {
				if (!scope.value) {
					scope.value = '?';
				}
			}
		}
	}]);