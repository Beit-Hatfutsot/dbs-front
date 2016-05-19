/**
 * @ngdoc object
 * @name auth.controller:LoginCtrl
 *
 * @description
 * Controller for login link sent by email. It uses the start templates, and
 * sends the login token to the api server to get the authnitication token.
 */
var LoginCtrl = function($stateParams, auth, notification) {

    var self = this;

	var token = $stateParams.token;
	notification.loading(true);
	auth.login(token).then(function () {
		notification.loading(false);
		// TODO:  redirect to next
	});
}
angular.module('auth').controller('LoginCtrl',
		['$stateParams', 'auth', 'notification', LoginCtrl]);
