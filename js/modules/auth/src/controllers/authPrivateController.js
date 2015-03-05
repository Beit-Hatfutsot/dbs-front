var AuthPrivateController = function($scope, $state, $window, auth) {
	var self = this;

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

	$scope.$watch(function() {
		return self.signedin;
	}, 
	function(signedin) {
		if (!signedin) {
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

angular.module('auth').controller('AuthPrivateController', ['$scope', '$state', '$window', 'auth', AuthPrivateController]);