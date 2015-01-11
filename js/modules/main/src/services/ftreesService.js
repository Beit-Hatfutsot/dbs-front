angular.module('main').
	factory('ftrees', ['$http', '$q', 'apiClient', function($http, $q, apiClient) {
		var in_progress = false;
		var ftrees = {
			search: function(params) {
				if (!in_progress) { 
					in_progress = true;
					var deferred = $q.defer();

					$http.get(apiClient.urls.ftrees_search, {params: params}).
						success(function(individuals) {
							deferred.resolve(individuals);
						}).
						error(function() {
							deferred.reject();
						}).
						finally(function() {
							in_progress = false;
						});

					return deferred.promise;
				}
			},

			get: function(tree_number) {
				if (!in_progress) {
					in_progress = true;
					var deferred = $q.defer();

					$http.get(apiClient.urls.ftrees_get + '/' + tree_number).
						success(function(tree_data) {
							deferred.resolve(tree_data);
						}).
						error(function() {
							deferred.reject();
						}).
						finally(function() {
							in_progress = false;
						});

					return deferred.promise;
				}
			}
		}

		return ftrees;
	}]);