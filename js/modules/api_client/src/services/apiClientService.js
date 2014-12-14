angular.module('apiClient').

	factory('apiClient', function() {
	
	  	return {

	  		urls: {
	  			auth: 			'http://bhsapi.ezdr.net/auth',
	  			user: 			'http://bhsapi.ezdr.net/user', 
	  			wizard_search: 	'http://bhsapi.ezdr.net/wsearch',
	  			item: 			'http://bhsapi.ezdr.net/item',
	  			suggest: 		'http://127.0.0.1:1234'
	  		}
	  	};
	});
