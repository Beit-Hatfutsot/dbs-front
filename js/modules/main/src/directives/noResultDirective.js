angular.module('main').directive('noResult', ['$rootScope', function($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/no-result.html',
		link: function(scope, element, attributes) {
			scope.content_type = attributes['content'];
		}
	};
}]);