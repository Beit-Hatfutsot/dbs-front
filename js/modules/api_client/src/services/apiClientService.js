angular.module('apiClient').

	factory('apiClient', function() {
	
	  	return {
	  		/*
	  		urls: {
	  			auth: 			'http://127.0.0.1:5000/auth',
	  			user: 			'http://127.0.0.1:5000/user', 
	  			mjs: 			'http://127.0.0.1:5000/mjs', 
	  			wizard_search: 	'http://127.0.0.1:5000/wsearch',
	  			item: 			'http://127.0.0.1:5000/item',
	  			suggest: 		'http://127.0.0.1:5000/suggest',
	  			ftrees_search:	'http://127.0.0.1:5000/fsearch',
	  			ftrees_get: 	'http://127.0.0.1:5000/get_ftree_url'
	  		}*/
	  		
	  		urls: {
	  			auth: 			'http://bhsapi.ezdr.net/auth',
	  			user: 			'http://bhsapi.ezdr.net/user', 
	  			mjs: 			'http://bhsapi.ezdr.net/mjs', 
	  			wizard_search: 	'http://bhsapi.ezdr.net/wsearch',
	  			item: 			'http://bhsapi.ezdr.net/item',
	  			suggest: 		'http://bhsapi.ezdr.net/suggest',
	  			ftrees_search:	'http://bhsapi.ezdr.net/fsearch',
	  			ftrees_get: 	'http://bhsapi.ezdr.net/get_ftree_url'
	  		}
	  	};
	});
