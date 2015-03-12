var AuthPrivateController = function($scope, $state, $window, auth, user) {
	var self = this;

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

angular.module('auth').controller('AuthPrivateController', ['$scope', '$state', '$window', 'auth', 'user', AuthPrivateController]);