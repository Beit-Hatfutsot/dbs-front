'use strict';

describe('lang-directives', function() {

	beforeEach(function() {
		module('lang');
	});

	describe('en, he', function() {
		var scope, en_element, he_element;

		function set_lang(scope, language) {
	        	
        	scope.$apply(function(scope) {
        		scope.langManager.lang = language;
        	});
        }

		beforeEach(inject(function ($compile, $rootScope, langManager) {
	       	scope = $rootScope.$new();
	       	scope.langManager = langManager;
	        en_element = angular.element('<en></en>');
	        he_element = angular.element('<he></he>');
	    	$compile(en_element)(scope);
    		$compile(he_element)(scope);
	    }));

	    it('should be visible only under the right language', function() {

	    	set_lang(scope, 'he');

	    	var en_div = angular.element( en_element.children()[0] ),
	    		he_div = angular.element( he_element.children()[0] )

	    	expect(en_div.hasClass('ng-hide')).toBe(true);
	    	expect(he_div.hasClass('ng-hide')).toBe(false);

	    	set_lang(scope, 'en');

	    	expect(en_div.hasClass('ng-hide')).toBe(false);
	    	expect(he_div.hasClass('ng-hide')).toBe(true);
	    });
	});
});