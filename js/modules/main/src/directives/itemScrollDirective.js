angular.module('main').
	directive('itemScroll', [function() {
		return {
			restrict: 'A',
			scope: {},
			controller: ['$scope', 'header', function($scope, header) {
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

				element.bind('scroll', function() {
					if (element[0].scrollTop != 0 && scope.sub_header_state != 'closed') {
						scope.$apply(function(scope) {
							scope.sub_header_state = 'closed';
						});
					}
				});
			}
		}
	}]);