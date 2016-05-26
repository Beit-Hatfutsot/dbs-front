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

/**
 * @ngdoc directive
 * @name authPrivate
 * @restrict E
 * 
 * @description
 * Protects transcluded content with authentication modal. 
 *
 * @scope
 * @param {boolean} on Switches the directive on & off (for example, 
 * 		            if some property is true, request authentication). 
 */
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
