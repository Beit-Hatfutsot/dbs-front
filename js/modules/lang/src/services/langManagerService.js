angular.module('lang').

	factory('langManager', function() {

	  	var lang_manager = {

	  		lang: window.localStorage.language || 'en'

	  	};

  		return lang_manager;
	});
