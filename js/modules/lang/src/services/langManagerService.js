angular.module('lang').

	factory('langManager', ['$window', function($window) {
		var _lang = $window.localStorage.getItem('bhsclient_language') || 'en';

	  	var lang_manager = {

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
