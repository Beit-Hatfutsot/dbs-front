angular.module('lang').
	factory('langManager', ['$window', function($window) {
		var _lang = $window.localStorage.getItem('bhsclient_language') || 'en';

		/**
		 * @ngdoc service
		 * @name langManager
		 * @module lang
		 * 
		 * @description
		 * This service stores information about the current (selected) language.
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
	  			$window.localStorage.setItem('bhsclient_language', new_lang);
	  			_lang = new_lang;
	  		}

	  	};

  		return lang_manager;
	}]);
