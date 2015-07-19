angular.module('main').
	directive('preventRightclick', [function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element[0].addEventListener('contextmenu', function(e) {
					e.preventDefault();
				}, false);
			}
		}
	}]);