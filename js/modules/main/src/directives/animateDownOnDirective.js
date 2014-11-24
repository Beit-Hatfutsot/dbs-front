angular.module('main').directive('animateDown', [function() {
	return {
		restrict: 'EA',
		scope: {
			trigger: '=on'
		},
		link: function(scope, element) {
			scope.$watch('trigger', function(newVal, oldVal) {
				var search_again_domelement = document.querySelector('#search-again');
				if (search_again_domelement) {
					var search_again_height = search_again_domelement.offsetHeight;
					
					element.css('-webkit-transition', 'all 0.7s ease');
					element.css('-moz-transition', 'all 0.7s ease');
					element.css('-msie-transition', 'all 0.7s ease');
					element.css('transition', 'all 0.7s ease');
					if (newVal !== true) {	
						element.css('transform', 'translate(0,0)');
					}
					else {
						element.css('transform', 'translate(0, ' + search_again_height + 'px)');
					}
				}
			});
		}
	}
}]);
