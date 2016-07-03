/**
 * @ngdoc module
 * @name config
 * @module config
 * @description
 * A module to hold BHSClient configuration.
 * This Module is edited by the Gulp base-url task
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
        baseUrl:        'BaseUrlPlaceHolder',
    }).
	constant('europeanaUrl',
			 'http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn');

