angular.module('lang').
	directive('en', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			replace: true,
			
			scope: {},
		  		
		    template: "<span ng-transclude style=\"width: inherit; height: inherit;\" class=\"en\" ng-show=\"langManager.lang == 'en'\"></span>",

		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]).

	directive('he', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			replace: true,

			scope: {},
		  		
		    template: "<span ng-transclude style=\"width: inherit; height: inherit;\" class=\"he\" ng-show=\"langManager.lang == 'he'\"></span>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]);