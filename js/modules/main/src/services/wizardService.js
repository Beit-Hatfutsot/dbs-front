angular.module('main').
	factory('wizard', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		
		var searchClient = $resource(apiClient.urls.wizard_search);

		var wizard = {
			result: {},
			
			last_search: {
				name: '',
				place: ''
			},
			
			clear: function() {
				this.result = {};
			},
			
			search: function(name, place) {
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
						self.last_search.name = name;
						self.last_search.place = place;
						angular.forEach(result.bingo, function(item) {
							cache.put(item)
						});
					
						deferred.resolve(result);
					},
					function() {
						deferred.reject();
					});

	  			return deferred.promise;
		  	}
		};

		return wizard;
	}]);