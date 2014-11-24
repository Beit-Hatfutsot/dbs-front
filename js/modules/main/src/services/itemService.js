angular.module('main').
	factory('item', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		var item_service, itemClient;

		itemClient = $resource(apiClient.urls.item +'/:item_id');

		item_service = {
			
			get: function(item_id) {
				var self 		= this,
					deferred	= $q.defer(),
					cached		= cache.get(item_id); 
					
				if (cached.isNotEmpty()) {
					deferred.resolve(cached);
				} 
				else {
					itemClient.get({item_id: item_id}).
						$promise.
						then(function(response) {
							cache.put(response.item_data);
							deferred.resolve(response.item_data);
						},
						function() {
							deferred.reject();
						});
				}

				return deferred.promise;
			}
		};

		return item_service;
	}]);