angular.module('main').
	service('tokenVerifier', ['apiClient', '$http', function(apiClient, $http) {
		var verification_url = apiClient.urls.verify_email;

		this.verify = function(token) {
			var full_url = verification_url + '/' + token;
			return $http.get(full_url);
		};
}]);