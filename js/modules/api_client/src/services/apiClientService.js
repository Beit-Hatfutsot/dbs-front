angular.module('apiClient').
	factory('apiClient', function() {

	  	var api_client = {
	  		base_url: 'http://api.myjewishidentity.org/',

	  		endpoints: {
	  			auth: 			'auth',
	  			user: 			'user', 
	  			mjs: 			'mjs', 
	  			wizard_search: 	'wsearch',
	  			item: 			'item',
	  			suggest: 		'suggest',
	  			ftrees_search:	'fsearch',
	  			ftrees_get: 	'get_ftree_url',
	  			upload: 		'upload'
	  		},

	  		urls: {}
	  	};

	  	angular.forEach(api_client.endpoints, function(endpoint, endpoint_key) {
		  	Object.defineProperty(api_client.urls, endpoint_key, {
				get: function() {
					return api_client.base_url + api_client.endpoints[endpoint_key];
				}  		
			});
		});

	  	return api_client;
	});
