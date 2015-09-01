/**
 * @ngdoc object
 * @name auth.controller:AuthPrivateController
 *
 * @description
 * Controller for the {@link module:auth.directive:authPrivate} directive.
 * Mainly, just sets a watcher on its `signin` property, so when no user is signed in
 * the auth modal opens.
 */

var AuthPrivateController = function($scope, $state, auth, user) {
	var self = this;

	/**
	 * @ngdoc property 
	 * @name AuthPrivateController#signedin
	 *
	 * @description
	 * Returns `true` if user is signed-in, `false` otherwise.
	 * 
	 * @returns {boolean}
	 */
	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

	$scope.$watch(function() {
		return self.signedin || !(user.$resolved);
	}, 
	function(signedin) {
		if ( !signedin && self.on ) {
			auth.authenticate({
				mandatory: true,
				fallback_state: $state.lastState.name ? $state.lastState : 'start',
				fallback_state_params: $state.lastStateParams
			});
		}
	});
};

AuthPrivateController.prototype = {

};

angular.module('auth').controller('AuthPrivateController', ['$scope', '$state', 'auth', 'user', AuthPrivateController]);
