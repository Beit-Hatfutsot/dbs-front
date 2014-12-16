angular.module('main').
	factory('user', ['$resource', 'apiClient', function($resource, apiClient) {
		return $resource(apiClient.urls.user);
	}]);