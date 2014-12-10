angular.module('main').directive('noResult', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/no-result.html',
		controller: ['$scope', function($scope) {
			
		}],
		link: function(scope, element, attributes) {
			scope.content_type = attributes['content'];
		}
	};
}]);