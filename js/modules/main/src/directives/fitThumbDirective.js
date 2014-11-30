angular.module('main').directive('fitThumb', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element) {
			
			$timeout(function() {
				var width = element[0].naturalWidth,
				height = element[0].naturalHeight,
				ratio;
				
				if (width !== undefined && height !== undefined) {
					ratio = height/width;
				
					if (ratio < 1) {
						element.css('height', '100%');
					}
					else {
						element.css('width', '100%');
					}
				}
			});
		}
	}
}]);