angular.module('main').directive('animateDown', ['$q', function($q) {
	return {
		restrict: 'A',
		scope: {
			trigger: '=when',
			by: '@'
		},
		link: function(scope, element) {
			scope.$watch('trigger', function(newVal, oldVal) {

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
					var domelement = document.querySelector(scope.by);
					var height = domelement.offsetHeight;
					element.css('-webkit-transform', 'translate(0, ' + height + 'px)');
					element.css('-moz-transform', 'translate(0, ' + height + 'px)');
					element.css('-o-transform', 'translate(0, ' + height + 'px)');
					element.css('-ms-transform', 'translate(0, ' + height + 'px)');
					element.css('transform', 'translate(0, ' + height + 'px)');
				}
			});
		}
	}
}]);
