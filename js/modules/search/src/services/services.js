angular.module('search').

	factory('searchManager', ['apiClient', '$q', '$resource', function(apiClient, $q, $resource) {
		var searchClient, search_manager;

		searchClient = $resource(apiClient.urls.search +'/:search_type', null, {
			wizard_search: { 
				method: 'GET', 
				params: {search_type: 'wizard'} 
			}
		});

	  	search_manager = {

	  		in_progress: false,

	  		wizard_search: function(name, place) {
	  			var self = this,
	  				result_deferred = $q.defer();
	  			
	  			this.in_progress = true; 

	  			searchClient.wizard_search({
	  				name: name,
	  				place: place	
	  			}).$promise.
  				then(function(result) {
  					result_deferred.resolve(result);
  				},
  				function() {
  					result_deferred.reject();
  				}).
  				finally(function() {
  					self.in_progress = false;
  				});

	  			return result_deferred.promise;
	  		}
	  	};

  		return search_manager;
	}]);
