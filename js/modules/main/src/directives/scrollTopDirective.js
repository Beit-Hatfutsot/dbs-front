angular.module('main').
	directive('scrollTop', [function() {
		return {
			restrict: 'A',
			scope: {},
			controller: ['$scope', 'wizard', function($scope, wizard) {
				Object.defineProperty($scope, 'search_status', {
					get: function() {
						return wizard.search_status;
					}
				});
			}],
			link: function(scope, element) {
				scope.$watch('search_status', function(newVal, oldVal) {
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