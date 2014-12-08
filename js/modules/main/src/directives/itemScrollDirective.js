angular.module('main').directive('itemScroll', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {

			scope.$watch('mainController.secondary_header_state', function(newVal, oldVal) {
				if (newVal != 'closed') {
					element[0].scrollTop = 0;
				}
			});

			element.bind('scroll', function() {
				if (element[0].scrollTop != 0 && scope.mainController.secondary_header_state != 'closed') {
					scope.$apply(function(scope) {
						scope.mainController.secondary_header_state = 'closed';
					});
				}
			});
		}
	}
});