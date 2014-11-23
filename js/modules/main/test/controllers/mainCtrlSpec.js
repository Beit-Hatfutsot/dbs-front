'use strict';

describe('MainCtrl', function() {

	var scope;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new(); 
		$controller('MainCtrl as mainController', {$scope: scope});
	}));

	it('should set and get a language', function() {
		scope.mainController.lang = 'en';
		expect(scope.mainController.lang).toBe('en');

		scope.mainController.lang = 'he';
		expect(scope.mainController.lang).toBe('he');
	});

	it('should disable submit if name AND place are empty strings', function() {
		expect(scope.mainController.submit_disabled).toBe(true);

		scope.mainController.wizard_query.name = 'test';
		expect(scope.mainController.submit_disabled).toBe(false);

		scope.mainController.wizard_query.name = '';
		scope.mainController.wizard_query.place = 'test';
		expect(scope.mainController.submit_disabled).toBe(false);
	});
});
