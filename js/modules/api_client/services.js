'use strict';

/* Services */

angular.module('apiClient', []).

	factory('apiClient', function() {
	
	  	return {

	  		urls: {
	  			auth: 		'http://127.0.0.1:5000/auth',
	  			search: 	'http://127.0.0.1:5001/search'
	  		}
	  	}
	});
