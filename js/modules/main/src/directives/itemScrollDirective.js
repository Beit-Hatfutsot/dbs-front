angular.module('main').
	directive('itemScroll', ['$window', function($window) {
		return {
			restrict: 'A',
			scope: {},
			controller: ['$scope', '$window', 'header', function($scope, $window, header) {
				Object.defineProperty($scope, 'sub_header_state', {
					get: function() {
						return header.sub_header_state;
					},
					set: function(new_sub_header_state) {
						header.sub_header_state = new_sub_header_state;
					}
				});
			}],
			link: function(scope, element) {
				scope.$watch('sub_header_state', function(newVal, oldVal) {
					if (newVal != 'closed') {
						element[0].scrollTop = 0;
					}
				});

				angular.element($window).bind('scroll', function() {
					if (element[0].scrollTop != 0 && scope.sub_header_state != 'closed') {
						scope.$apply(function(scope) {
							scope.sub_header_state = 'closed';
						});
					}
				});
			}
		}
	}]);