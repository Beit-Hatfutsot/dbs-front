/**
 * @ngdoc service
 * @name apiClient
 * @module apiClient
 * @requires apiConfig
 * 
 * @description
 * Provides access to API endpoints. 
 *
 * @property {String} base_url The base URL for the BHS API.
 * @property {Object} endpoints Maps endpoint names to values from {@link config.apiConfig}.
 * @property {Object} urls An object that maps API endpoint names to full endpoint URLs.
 */
angular.module('apiClient').
	factory('apiClient', ['apiConfig', function(apiConfig) {

	  	var api_client = {
	  		base_url: 'http://' + apiConfig.baseUrl,

	  		
	  		endpoints: {
	  			signin: 		apiConfig.signing,
	  			login: 			apiConfig.login, 
	  			user: 			apiConfig.user, 
	  			mjs: 			apiConfig.mjs, 
	  			wizard_search: 	apiConfig.wizard_search,
	  			item: 			apiConfig.item,
	  			suggest: 		apiConfig.suggest,
	  			ftrees_search:	apiConfig.ftrees_search,
	  			ftrees_get: 	apiConfig.ftrees_get,
	  			upload: 		apiConfig.upload,
	  			verify_email: 	apiConfig.verify_email,
	  			search:         apiConfig.search
	  		},

	  		urls: {}
	  	};

	  	angular.forEach(api_client.endpoints, function(endpoint, endpoint_key) {
		  	Object.defineProperty(api_client.urls, endpoint_key, {
				get: function() {
					return api_client.base_url + '/' + api_client.endpoints[endpoint_key];
				}  		
			});
		});

	  	return api_client;
	}]);
