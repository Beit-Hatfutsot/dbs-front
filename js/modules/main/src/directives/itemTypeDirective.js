angular.module('main').directive('itemType', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/item-type.html',
		scope: {
			type: '=',
			image: '=',
		},
	};
});



