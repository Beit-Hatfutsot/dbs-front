angular.module('main').
	directive('scrollTop', [function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				scope.$watch('mainController.search_status', function(newVal, oldVal) {
					if (newVal != 'none' && newVal != '') {
						setTimeout(function() {
							element.removeAttr('style');
							element[0].scrollTop = 322;
						}, 1000);
						element.css('-webkit-transition', 'all 1s linear');
						element.css('-moz-transition', 'all 1s linear');
						element.css('-o-transition', 'all 1s linear');
						element.css('-ms-transition', 'all 1s linear');
						element.css('transition', 'all 1s linear');
						element.css('overflow', 'hidden');
						element.css('height', '200%');
						element.css('margin-top', '-322px');
					}
				});
			}
		}
	}]);