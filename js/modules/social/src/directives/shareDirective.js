
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
		link: function(scope, element) { },
		controller: ['$scope', function($scope) {
			$scope.href = window.encodeURIComponent($scope.href);
		}]
	};
});

