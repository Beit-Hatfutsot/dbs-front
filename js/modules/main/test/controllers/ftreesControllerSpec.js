'use strict';

describe('FtreesController', function() {

	beforeEach(function() {
		module('main');
	});

	//var ; 

	beforeEach(inject(function($rootScope, $controller, $q, _$timeout_, $httpBackend) {

		$httpBackend.expectGET('templates/main/start.html').respond('');

		
	}));

	it('should ', function() {
		
	});
});
