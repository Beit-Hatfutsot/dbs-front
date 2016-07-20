
angular.module('social').directive('share', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/social/share.html',
		scope: {
			href: '=',
			text: '@',
			link: '=',
			facebook: '=',
			twitter: '='
		},
		link: function(scope, element, attrs) {
			scope.$watch('href', function(href) {
				if (href)
					scope.safe_href = window.encodeURIComponent(href);
			});
		}
	};
});

