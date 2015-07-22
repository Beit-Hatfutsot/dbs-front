/**
 * @ngdoc service
 * @name user
 * @module auth
 *
 * @description
 * A service to handle user data.
 */

angular.module('auth').
	factory('user', ['$resource', 'apiClient', function($resource, apiClient) {
		return $resource(apiClient.urls.user).get();
	}]);