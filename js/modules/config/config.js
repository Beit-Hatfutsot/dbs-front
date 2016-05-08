/**
 * @ngdoc module
 * @name config
 * @module config
 * @description
 * A module to hold BHSClient configuration.
 * This Module is compiled by the Grunt replace task in the project Gruntfile.
 */
angular.module('config', []).
    /**
     * @ngdoc service
     * @name apiConfig
     * @module config
     * @description
     * A map object for API enpoint names.
     */
    constant('apiConfig', {
        baseUrl:        'localhost:5000',
        auth:           'auth',
        user:           'user', 
        mjs:            'mjs', 
        wizard_search:  'wsearch',
        item:           'item',
        suggest:        'suggest',
        ftrees_search:  'fsearch',
        ftrees_get:     'get_ftree_url',
        ftrees_walk:    'fwalk',
        upload:         'upload',
        newsletter:         'newsletter',
        search:         'search'
    }).
	constant('europeanaUrl',
			 'http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn');

