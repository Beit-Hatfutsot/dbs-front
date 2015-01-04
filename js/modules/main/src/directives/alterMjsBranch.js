angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('keydown', function($event) {
					if ($event.keyCode === 13) {
						element[0].blur();
					}
				});
				element.bind('blur', function($event) {
					alter();
				});

				function alter() {	
					scope.mjsCtrl.save_story();
				}
			}
		};
	});