angular.module('main').directive('itemScroll', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {

			scope.$watch('mainController.sub_header_state', function(newVal, oldVal) {
				if (newVal != 'closed') {
					element[0].scrollTop = 0;
				}
			});

			element.bind('scroll', function() {
				if (element[0].scrollTop != 0 && scope.mainController.sub_header_state != 'closed') {
					scope.$apply(function(scope) {
						scope.mainController.sub_header_state = 'closed';
					});
				}
			});
		}
	}
});