angular.module('apiClient').

	factory('apiClient', function() {
	
	  	return {

	  		urls: {
	  			auth: 			'http://127.0.0.1:5000/auth',
	  			wizard_search: 	'http://127.0.0.1:5001/search/wizard',
	  			item: 			'http://127.0.0.1:5001/item'
	  		}
	  	}
	});
