'use strict';

/* Services */

angular.module('search', []).

	factory('searchManager', function() {

	  	var search_manager = {

	  		wizard_search: function(name, place) {
	  			console.log('search!');
	  		}
	  	};

  		return search_manager;
	});
