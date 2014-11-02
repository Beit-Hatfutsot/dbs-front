'use strict';

describe('wizard-result-controllers', function() {

	beforeEach(function() {
		module('ngResource')
		module('ui.router');
		module('apiClient')
		module('search');
		module('wizardResult');
	});

	describe('WizardResultCtrl', function() {

		var scope, result, $timeout;

		beforeEach(inject(function($rootScope, $controller, $q, _$timeout_) {
			result = {names: [], places: [], trees: []};
			$timeout = _$timeout_;

			var wizard_search = jasmine.createSpy('searchManager.wizard_search').
				andCallFake(function() {
					var deferred = $q.defer();

					$timeout(function() {
						deferred.resolve(result);
					});

					return deferred.promise;
				}); 

			var searchManager = {
				wizard_search: wizard_search
			};

			var stateParams = {
				name: 'test-name',
				place: 'test-place'
			};

			scope = $rootScope.$new(); 
			scope.wizardController = {};
			$controller('WizardResultCtrl as wizardResultController', {
				$scope: scope,
				searchManager: searchManager,
				$stateParams: stateParams
			});
		}));

		it('should search', function() {
			scope.$emit('$viewContentLoaded');
			$timeout.flush();
			
			expect(scope.wizardResultController.result).toBe(result);
		});

		it('should set proper view modes', function() {
			result = {
				names: [{}, {}],
				places: [{}],
				trees: []
			}
			scope.$emit('$viewContentLoaded');
			$timeout.flush();

			expect(scope.wizardResultController.view_mode('names')).toEqual('multiple');
			expect(scope.wizardResultController.view_mode('places')).toEqual('single');
			expect(scope.wizardResultController.view_mode('trees')).toEqual('none');
		});

		it('should properly set search_status & search_again_visible', function() {
			result = {
				names: [{}],
				places: [{}],
				trees: []
			}
			scope.$emit('$viewContentLoaded');
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('bingo');
			expect(scope.wizardResultController.search_again_visible).toBe(false);

			result = {
				names: [{}, {}],
				places: [{}],
				trees: []
			}
			scope.$emit('$viewContentLoaded');
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('suggestions');
			expect(scope.wizardResultController.search_again_visible).toBe(true);

			result = {
				names: [],
				places: [{}],
				trees: []
			}
			scope.$emit('$viewContentLoaded');
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('none');
			expect(scope.wizardResultController.search_again_visible).toBe(true);
		});
	});
});