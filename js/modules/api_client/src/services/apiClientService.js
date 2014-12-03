angular.module('apiClient').

	factory('apiClient', function() {
	
	  	return {

	  		urls: {
	  			auth: 			'http://bhsapi.ezdr.net/auth',
	  			user: 			'http://bhsapi.ezdr.net/user', 
	  			wizard_search: 	'http://127.0.0.1:5001/search/wizard',
	  			item: 			'http://127.0.0.1:5001/item'
	  		}
	  	}
	});
