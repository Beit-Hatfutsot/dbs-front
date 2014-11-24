angular.module('main').directive('animateDown', [function() {
	return {
		restrict: 'EA',
		scope: {
			trigger: '=when'
		},
		link: function(scope, element) {

			scope.$watch('trigger', function(newVal, oldVal) {
				var search_again_domelement = document.querySelector('#search-again');
				if (search_again_domelement) {
					var search_again_height = search_again_domelement.offsetHeight;
					
					element.css('-webkit-transition', 'all 0.7s ease');
					element.css('-moz-transition', 'all 0.7s ease');
					element.css('-o-transition', 'all 0.7s ease');
					element.css('-ms-transition', 'all 0.7s ease');
					element.css('transition', 'all 0.7s ease');
					
					if (newVal !== true) {	
						element.css('-webkit-transform', 'translate(0,0)');
						element.css('-moz-transform', 'translate(0,0)');
						element.css('-o-transform', 'translate(0,0)');
						element.css('-ms-transform', 'translate(0,0)');
						element.css('transform', 'translate(0,0)');
					}
					else {
						element.css('-webkit-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-moz-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-o-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-ms-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('transform', 'translate(0, ' + search_again_height + 'px)');
					}
				}
			});
		}
	}
}]);
