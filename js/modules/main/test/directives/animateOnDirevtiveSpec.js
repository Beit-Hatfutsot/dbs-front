'use strict';

describe('en, he', function() {
	var scope, element;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
		$httpBackend.expectGET('templates/main/start.html').respond('');
       	scope = $rootScope.$new();
       	scope.trigger = false;
        element = angular.element('<div id="search-again" style="height: 100px;"></div></div><div animate-down when="trigger"></div>');
		$compile(element)(scope);
    }));

    it('should move element down when triggered', function() {
    	scope.trigger = true;
    	scope.$digest();
    
    	element.css('transform');
    });
});
