'use strict';

describe('auth-directives', function() {

	beforeEach(function() {
		module('ui.router');
		module('lang');
		module('auth');
		module(function($provide) {
			$provide.provider('authManager', function () { 
		        this.$get = function () {
		            return {
		                authenticate: jasmine.createSpy('authManager.authenticate')
		            };
		        }
		    });
		});
	});

	describe('needAuth', function() {
		var scope, $compile, authManager;

		beforeEach(inject(function (_$compile_, $rootScope, _authManager_) {
			$compile = _$compile_;
	       	scope = $rootScope.$new();
	       	authManager = _authManager_;
	    }));

	    it('should call authenticate with correct arguments when next-state attribute is not present', function() {
	    	var element = angular.element('<button need-auth="true"></button>');
	    	$compile(element)(scope);
	    	
	 		element.triggerHandler('click');

	    	expect(authManager.authenticate).toHaveBeenCalledWith('', { mandatory: true });
	    });


	    it('should call authenticate with correct arguments when next-state attribute is present', function() {
	    	var element = angular.element('<button need-auth="false" next-state="testState"></button>');
	    	$compile(element)(scope);
	    	
	 		element.triggerHandler('click');

	    	expect(authManager.authenticate).toHaveBeenCalledWith('testState', { mandatory: false });
	    });
	});
});