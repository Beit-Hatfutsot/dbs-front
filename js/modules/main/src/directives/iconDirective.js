angular.module('main').directive('icon', ['langManager', function(langManager) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/icon.html',
		scope: {
			source: '@',
			altText: '=',
			position: '=',
			hoverOffset: '='
		},
		link: function(scope, element) {
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
					image.css('left', scope.position[0] + scope.hoverOffset[0] + 'px');
					image.css('top', scope.position[1] + scope.hoverOffset[1] + 'px');
				});
				image.bind('mouseleave', function() {
					image.css('left', scope.position[0] + 'px');
					image.css('top', scope.position[1] + 'px');
				});
			}
		}
	}
}]);