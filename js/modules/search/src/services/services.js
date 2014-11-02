angular.module('search').

	factory('searchManager', ['apiClient', '$resource', function(apiClient, $resource) {
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
	  				search_promise;
	  			
	  			this.in_progress = true; 

	  			search_promise = searchClient.wizard_search({
  					name: name,
  					place: place	
  				}).$promise;
  					
  				search_promise.finally(function() {
  					self.in_progress = false;
  				});

  				return search_promise;
	  		}
	  	};

  		return search_manager;
	}]);
