/**
 * @ngdoc object
 * @name auth.controller:LoginCtrl
 *
 * @description
 * Controller for login link sent by email. It uses the start templates, and
 * sends the login token to the api server to get the authnitication token.
 */
var LoginCtrl = function($state, $stateParams, auth, notification) {

    var self = this;

	var token = $stateParams.token;
	notification.loading(true);
	auth.login(token).then(function () {
		notification.loading(false);
		if (auth.user.next_state)
			$state.go(auth.user.next_state, auth.user.next_params)
		else
			$state.go("mjs");
	}, function(response) {
		notification.loading(false);
		notification.put(17);
	}
						  );
}
angular.module('auth').controller('LoginCtrl',
		['$state', '$stateParams', 'auth', 'notification', LoginCtrl]);
