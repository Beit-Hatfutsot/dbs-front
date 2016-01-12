angular.module('main').directive('mjsItem', function() {
	return {
		restrict: 'EA',
		scope: {
			item: '=',
			nonDraggable: '='
		},
		templateUrl: 'templates/main/mjs/mjs-item.html'
	};
});
