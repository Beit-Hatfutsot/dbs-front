'use strict';

angular.module('lang', []).
	directive('en', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			scope: {},
		  		
		    template: "<div ng-transclude class=\"en\" ng-show=\"langManager.lang == 'en'\" ng-transclude></div>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}).

	directive('he', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			scope: {},
		  		
		    template: "<div ng-transclude class=\"he\" ng-show=\"langManager.lang == 'he'\" ng-transclude></div>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	});