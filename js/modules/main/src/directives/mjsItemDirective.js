angular.module('main').directive('mjsItem', function() {
	return {
		restrict: 'EA',
		scope: {
			item: '='
		},
		controller: 'MjsItemController as mjsItemCtrl',
		templateUrl: 'templates/main/mjs/mjs-item.html'
	};
});