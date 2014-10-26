'use strict';

angular.module('search', []).

	factory('searchManager', ['$timeout', '$q', function($timeout, $q) {

	  	var search_manager = {

	  		in_progress: false,

	  		wizard_search: function(name, place) {
	  			var self = this,
	  			result_deferred = $q.defer(); 

	  			this.in_progress = true;
	  			$timeout(function() {
	  				self.in_progress = false; 
	  				result_deferred.resolve({
	  					places: [{header:'place'}], 
	  					names: [{header:'name'}]
	  				});
	  			}, 1000);

	  			return result_deferred.promise;
	  		}
	  	};

  		return search_manager;
	}]);
