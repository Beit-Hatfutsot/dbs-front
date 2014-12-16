angular.module('main').
	factory('mjs', ['$resource', 'apiClient', function($resource, apiClient) {
		var mjs = $resource(apiClient.urls.mjs, null, {
			put: {method: 'PUT'}
		});
			
		return mjs;
	}]);