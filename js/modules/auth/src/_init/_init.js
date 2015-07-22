/**
 * @ngdoc module
 * @name auth
 * @module auth
 *
 * @description
 * This module handles user authentication & data.
 */

angular.module('auth', ['apiClient']).
	config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}]);