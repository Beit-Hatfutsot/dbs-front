angular.module('lang').
	factory('langManager', ['$window', '$rootScope', function($window, $rootScope) {
		var _lang = 'en';

		/**
		 * @ngdoc service
		 * @name langManager
		 * @module lang
		 * 
		 * @description
		 * This service stores information about the current (selected) language.
		 *
		 * @fires $rootScope#language-changed
		 */
	  	var lang_manager = {

	  		/**
	  		 * @ngdoc property
	  		 * @name langManager#lang
	  		 *
	  		 * @description
	  		 * Current (selected) language (`'en'` or `'he'`)
	  		 * When this property is set, the current language is set on `localStorage`.
	  		 */
	  		get lang() {
	  			return _lang;
	  		},

	  		set lang(new_lang) {
				if (new_lang != _lang) {
					_lang = new_lang;
					$rootScope.$broadcast('language-changed', _lang)
				}
	  		}

	  	};

  		return lang_manager;
	}]);
