angular.module('auth').directive('needAuth', ['$state', 'auth', function($state, auth) {
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

				auth.authenticate(nextState, { mandatory: isMandatory });
			});
		}
	}
}]);