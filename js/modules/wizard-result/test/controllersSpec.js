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

		var scope, result, $timeout, createCtrl;

		beforeEach(inject(function($rootScope, $controller, $q, _$timeout_) {

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

			result = {
				bingo: {
					name: null, 
					place: null
				}, 

				suggestions: {
					name: null,
					place: null
				}
			};

			$timeout = _$timeout_;

			scope = $rootScope.$new();
			scope.wizardController = {};

			createCtrl = function() {
				return $controller('WizardResultCtrl as wizardResultController', {
					$scope: scope,
					searchManager: searchManager,
					$stateParams: stateParams
				});
			}
		}));
		
		it('should search', function() {
			createCtrl();
			$timeout.flush();
			expect(scope.wizardResultController.result).toBe(result);
		});
		
		it('should properly set search_status & search_again_visible', function() {
			result = {
				bingo: {
					name: {},
					place: {}
				},

				suggestions: {
					name: null,
					place: null
				}
			};
			createCtrl();
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('bingo');
			expect(scope.wizardResultController.search_again_visible).toBe(false);

			result = {
				bingo: {
					name: null,
					place: null
				},

				suggestions: {
					name: {},
					place: null
				}
			}
			createCtrl();
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('suggestions');
			expect(scope.wizardResultController.search_again_visible).toBe(true);

			result = {
				bingo: {
					name: null,
					place: null
				},

				suggestions: {
					name: null,
					place: null
				}
			}
			createCtrl();
			$timeout.flush();
			
			expect(scope.wizardResultController.search_status).toEqual('none');
			expect(scope.wizardResultController.search_again_visible).toBe(true);
		});
	});
});