'use strict';

/* Services */

angular.module('search', []).

	factory('searchManager', ['$timeout', function($timeout) {

	  	var search_manager = {

	  		in_progress: false,

	  		wizard_search: function(name, place) {
	  			var self = this;

	  			this.in_progress = true;
	  			$timeout(function() {self.in_progress = false}, 2000);
	  		}
	  	};

  		return search_manager;
	}]);
