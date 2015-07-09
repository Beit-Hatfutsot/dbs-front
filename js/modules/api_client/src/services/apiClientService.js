angular.module('apiClient').
	factory('apiClient', function() {
	
	  	return {
	  		
	  		urls: {
	  			auth: 			'http://127.0.0.1:5000/auth',
	  			user: 			'http://127.0.0.1:5000/user', 
	  			mjs: 			'http://127.0.0.1:5000/mjs', 
	  			wizard_search: 	'http://127.0.0.1:5000/wsearch',
	  			item: 			'http://127.0.0.1:5000/item',
	  			suggest: 		'http://127.0.0.1:5000/suggest',
	  			ftrees_search:	'http://127.0.0.1:5000/fsearch',
	  			ftrees_get: 	'http://127.0.0.1:5000/get_ftree_url',
	  			upload: 		'http://127.0.0.1:5000/upload'
	  		}
	  		
	  		// urls: {
	  		// 	auth: 			'http://api.myjewishidentity.org/auth',
	  		// 	user: 			'http://api.myjewishidentity.org/user', 
	  		// 	mjs: 			'http://api.myjewishidentity.org/mjs', 
	  		// 	wizard_search: 	'http://api.myjewishidentity.org/wsearch',
	  		// 	item: 			'http://api.myjewishidentity.org/item',
	  		// 	suggest: 		'http://api.myjewishidentity.org/suggest',
	  		// 	ftrees_search:	'http://api.myjewishidentity.org/fsearch',
	  		// 	ftrees_get: 	'http://api.myjewishidentity.org/get_ftree_url',
	  		// 	upload: 		'http://api.myjewishidentity.org/upload'
	  		// }
	  	};
	});
