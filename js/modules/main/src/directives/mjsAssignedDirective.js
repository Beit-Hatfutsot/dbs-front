angular.module('main').directive('mjsAssigned', function() {
	return {
		restrict: 'EA',
		templateUrl: 'templates/main/mjs/mjs-assigned.html',
		scope: true,
		link: function(scope, element, attrs, ctrl) {
			console.log(scope.branch)
			scope.icon_position = JSON.parse(attrs['iconPosition']);
			Object.defineProperty(scope, 'collection', {
				get: function() {
					return scope.branch.items[attrs['collectionName']];
				}
			});
			scope.$watch('collection', function(newVal, oldVal) {
				if (newVal) {
					if (newVal.length > 1) {
						scope.grouped = true;
					}
					else {
						scope.grouped = false;
					}
				}
			});
		}
	};
});