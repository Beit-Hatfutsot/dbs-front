angular.module('main').directive('icon', ['langManager', function(langManager) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/icon.html',
		scope: {
			source: '@',
			altText: '=',
			position: '=',
			hoverOffset: '=',
			offsetOn: '='
		},
		link: function(scope, element, attrs, ctrl) {
			function offset(image) {
				image.css('left', scope.position[0] + scope.hoverOffset[0] + 'px');
				image.css('top', scope.position[1] + scope.hoverOffset[1] + 'px');
			}

			function remove_offset(image) {
				image.css('left', scope.position[0] + 'px');
				image.css('top', scope.position[1] + 'px');
			}

			if (scope.source === undefined) {
				scope.default_source = 'images/icons.png';
			}

			Object.defineProperty(scope, 'lang_code', {
				get: function() {
					return langManager.lang;
				}
			});

			var image = element.find('img');
			
			image.css('left', scope.position[0] + 'px');
			image.css('top', scope.position[1] + 'px');
			
			if (scope.hoverOffset !== undefined) {
				image.bind('mouseenter', function() {
					offset(image);
				});
				image.bind('mouseleave', function() {
					if (!(scope.offsetOn)) {
						remove_offset(image);
					}
				});
			}

			if (scope.offsetOn !== undefined) {
				scope.$watch('offsetOn', function(newVal, oldVal) {
					if (newVal) {
						offset(image);
					}
					else {
						remove_offset(image);
					}
				});
			}
		}
	}
}]);