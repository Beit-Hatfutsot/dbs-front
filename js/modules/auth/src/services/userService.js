angular.module('auth').
	factory('user', ['$resource', 'apiClient', function($resource, apiClient) {
		return $resource(apiClient.urls.user).get();
	}]);