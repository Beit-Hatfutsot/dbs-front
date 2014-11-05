angular.module('lang').
	directive('en', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			scope: {},
		  		
		    template: "<span ng-transclude class=\"en\" ng-show=\"langManager.lang == 'en'\" ng-transclude></span>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]).

	directive('he', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			scope: {},
		  		
		    template: "<span ng-transclude class=\"he\" ng-show=\"langManager.lang == 'he'\" ng-transclude></span>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]);