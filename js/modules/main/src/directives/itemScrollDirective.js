angular.module('main').directive('itemScroll', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {

			scope.$watch('mainController.search_again_visible', function(newVal, oldVal) {
				if (newVal === true) {
					element[0].scrollTop = 0;
				}
			});

			element.bind('scroll', function() {
				if (element[0].scrollTop != 0 && scope.mainController.search_again_visible) {
					scope.$apply(function(scope) {
						scope.mainController.search_again_visible = false;
					});
				}
			});
		}
	}
});