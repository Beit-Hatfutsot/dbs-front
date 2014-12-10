angular.module('auth', []).
	config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}]);