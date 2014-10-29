angular.module('auth').directive('needAuth', ['$state', 'authManager', function($state, authManager) {
	return {
		restrict: 'A',
		scope: {
			nextState: '@',
			isMandatory: '@needAuth'
		},
		link: function(scope, element) {
			element.bind('click', function() {
				var nextState,
					isMandatory = JSON.parse(scope.isMandatory);
				
				if (scope.nextState === undefined) {
					nextState = $state.current.name;
				} else {
					nextState = scope.nextState;
				}

				authManager.authenticate(nextState, { mandatory: isMandatory });
			});
		}
	}
}]);