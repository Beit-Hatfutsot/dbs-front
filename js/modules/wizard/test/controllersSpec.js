'use strict';

describe('wizard-controllers', function() {

	beforeEach(function() {
		module('ui.router');
		module('lang')
		module('wizard');
	});

	describe('WizardCtrl', function() {

		var scope;

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new(); 
			$controller('WizardCtrl as wizardController', {$scope: scope});
		}));

		it('should disable submit if name and place are empty strings', function() {
			expect(scope.wizardController.submit_disabled).toBe(true);

			scope.wizardController.name = 'test';
			expect(scope.wizardController.submit_disabled).toBe(false);

			scope.wizardController.name = '';
			scope.wizardController.place = 'test';
			expect(scope.wizardController.submit_disabled).toBe(false);
		});
	});
});