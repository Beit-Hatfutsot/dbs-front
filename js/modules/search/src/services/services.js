angular.module('search').

	factory('searchManager', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		var searchClient, search_manager;

		searchClient = $resource(apiClient.urls.search +'/:search_type', null, {
			wizard_search: { 
				method: 'GET', 
				params: {search_type: 'wizard'}
			}
		});

	  	search_manager = {

	  		wizard_search: function(name, place) {
	  			var self = this, 
	  				search_promise,
	  				deferred = $q.defer();
	  			
	  			this.in_progress = true; 

	  			search_promise = searchClient.wizard_search({
  					name: name,
  					place: place	
  				}).$promise;
  					
  				search_promise
  					.then(function(result) {		
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
	  	};

  		return search_manager;
	}]);
