'use strict';

angular.module('auth').directive('needAuth', ['$state', 'authManager', function($state, authManager) {
	return {
		restrict: 'A',
		scope: {
			nextState: '@',
			mandatory: '@needAuth'
		},
		link: function(scope, element) {
			element.bind('click', function() {
				var nextState,
					mandatory = JSON.parse(scope.mandatory);
				
				if (scope.nextState === undefined) {
					nextState = $state.current.name;
				} else {
					nextState = scope.nextState;
				}

				authManager.authenticate(nextState, mandatory);
			});
		}
	}
}]);