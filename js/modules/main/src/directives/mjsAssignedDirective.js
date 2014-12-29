angular.module('main').directive('mjsAssigned', function() {
	return {
		restrict: 'EA',
		templateUrl: 'templates/main/mjs/mjs-assigned.html',
		scope: {
			collection: '=',
			iconPosition: '='
		},
		link: function(scope, element, attrs, ctrl) {
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