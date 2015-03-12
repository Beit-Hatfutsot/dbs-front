angular.module('auth').
	directive('needAuth', ['$state', 'auth', function($state, auth) {
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

angular.module('auth').
	directive('authTrigger', ['$state', 'auth', function($state, auth) {
		return {
			restrict: 'EA',
			scope: {
				mandatory: '='
			},
			link: function(scope, element, attrs) {
				var next_state = $state.current.name;
				window.$state = $state
				auth.authenticate({
					//next_state: next_state,
					fallback_state: 'start',
					mandatory: scope.mandatory 
				});
			}
		}
	}]);

angular.module('auth').
	directive('authPrivate' ,[function() {
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'templates/auth/auth-private.html',
			controller: 'AuthPrivateController as authPrivateCtrl',
			scope: {
				on: '='
			},
			link: function(scope, element, attrs, ctrl) {
				if (scope.on === undefined) {
					ctrl.on = true;
				}
				else {
					ctrl.on = scope.on;
				}
			}
		}
	}]);