angular.module('lang').
	
	/**
	 * @ngdoc directive
	 * @name en
	 * @restrict E
	 * 
	 * @description
	 * Shows transcluded content iff the language is set to English. 
	 *
	 * @scope 
	 */
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

	/**
	 * @ngdoc directive
	 * @name he
	 * @restrict E
	 * 
	 * @description
	 * Shows transcluded content iff the language is set to Hebrew. 
	 *
	 * @scope 
	 */
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