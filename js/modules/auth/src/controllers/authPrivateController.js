/**
 * @ngdoc object
 * @name auth.controller:AuthPrivateController
 *
 * @description
 * Controller for the {@link module:auth.directive:authPrivate} directive.
 * Mainly, just sets a watcher on its `signin` property, so when no user is signed in
 * the auth modal opens.
 */

var AuthPrivateController = function($scope, $state, auth) {
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

	if ( !this.signedin) {
		auth.authenticate({
			mandatory: true,
			fallback_state: 'start'
		});
	}
};

AuthPrivateController.prototype = {

};

angular.module('auth').controller('AuthPrivateController', ['$scope', '$state', 'auth', 'user', AuthPrivateController]);
