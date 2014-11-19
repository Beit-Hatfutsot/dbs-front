angular.module('main').
	factory('wizard', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		
		var searchClient = $resource(apiClient.urls.wizard_search);

		var wizard = {
			result: {},
			search: search
		};

		function search(name, place) {
  			var self = this, 
  				search_promise,
  				deferred = $q.defer();

  			search_promise = searchClient.get({
				name: name,
				place: place	
			}).$promise;
  					
			search_promise
				.then(function(result) {
					self.result = result;
					angular.forEach(result.bingo, function(item) {
						cache.write(item)
					});
				
					deferred.resolve(result);
				},
				function() {
					deferred.reject();
				});

  			return deferred.promise;
	  	}

		return wizard;
	}]);