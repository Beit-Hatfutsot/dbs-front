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

	  		urls: {
          login:          'login',
          auth:           'auth',
          user:           'user',
          mjs:            'mjs',
          wizard_search:  'v1/wsearch',
          item:           'v1/item',
          suggest:        'v1/suggest',
          ftrees_search:  'v1/person',
          upload:         'v1/upload',
          newsletter:     'v1/newsletter',
          search:         'v1/search',
          story:         'v1/story'
        }
	  	};

      // prefix all endpoints with base_url
	  	angular.forEach(api_client.urls, function(endpoint, endpoint_key) {
				api_client.urls[endpoint_key] = api_client.base_url + '/' + endpoint;
			});

      return api_client
		}
	]);
