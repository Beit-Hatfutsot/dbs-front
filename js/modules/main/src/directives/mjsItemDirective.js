angular.module('main')
.directive('mjsItem', ['$rootScope', 'item', function($rootScope, item) {
	return {
		restrict: 'EA',
		scope: {
			item: '=',
		},
		link: function(scope, element, attr) {
			scope.url = item.get_url(scope.item);
			$rootScope.$on('language-changed', function() {
				scope.url = item.get_url(scope.item);
			});
		},
		templateUrl: 'templates/main/mjs/mjs-item.html'
	};
}]);
