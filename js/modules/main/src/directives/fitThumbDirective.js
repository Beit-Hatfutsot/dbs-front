angular.module('main').directive('fitThumb', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element) {

			function check_tries(tries) {
				if (isNaN(+tries)) {
					tries = 5;
				}
				if(tries > 0){
					$timeout(function() {
						var width = element[0].naturalWidth,
						height = element[0].naturalHeight,
						ratio;
						if (width) {
							ratio = height/width;
						
							if (ratio > 0.65) {
								element.css('height', '100%');
							}
							else {
								element.css('width', '100%');
							}
						} else {
							check_tries(tries - 1);
						}
					}, 100);
				}
			}
			check_tries(10);
		}
	}
}]);


