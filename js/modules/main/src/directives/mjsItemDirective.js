angular.module('main').directive('mjsItem', function() {
	return {
		restrict: 'EA',
		scope: {
			item: '='
		},
		templateUrl: 'templates/main/mjs/mjs-item.html'
	};
});