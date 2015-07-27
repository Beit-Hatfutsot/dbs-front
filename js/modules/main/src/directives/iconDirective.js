angular.module('main').directive('icon', ['langManager', function(langManager) {
	/**
	 * @ngdoc directive
	 * @name icon
	 * @restrict E
	 * 	 
	 * @description
	 * This directive is an API that enables to use icons located on a sprite image.
	 * 
	 * @scope
	 * @param {String} source Source URL for the sprite image. Default is ```images/icons.png```
	 * @param {Array} position Position of the icon on the sprite (both coordinates should be negative).
	 * @param {Array} hoverOffset Offset of the icon to be displayed on hover, relative to the original icon position.
	 * @param {Object} altText English and Hebrew alt text for the icon img element; eg. ``` {en: 'english text', he:'טקסט בעברית'}``` 
	 * @param {expression} offsetOn Expression to listen to and offset icon on change. 
	 */
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/icon.html',
		scope: {
			source: '@',
			position: '=',
			hoverOffset: '=',
			altText: '=',
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