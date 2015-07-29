'use strict';

describe('auth-directives', function() {

	beforeEach(function() {
		module('auth');
		module('templates');
		module(function($provide) {
			$provide.provider('auth', function () { 
		        this.$get = function () {
		            return {
		            	is_signedin: function() {return false},
		                authenticate: jasmine.createSpy('auth.authenticate')
		            };
		        }
		    });
		});
		module(function($provide) {
			$provide.provider('$state', function () { 
		        this.$get = function () {
		            return {
		            	lastState: {
		            		name: 'test-fallback-state',
		            	},
		            	lastStateParams: {
		            		test_param: 'test-param'
		            	}
		            };
		        }
		    });
		});
		module(function($provide) {
			$provide.provider('user', function () { 
		        this.$get = function () {
		            return {
		            	$resolved: true
		            };
		        }
		    });
		});
	});

	describe('authPrivate', function() {
		var scope, $compile, auth;

		beforeEach(inject(function (_$compile_, $rootScope, _auth_) {
			$compile = _$compile_;
	       	scope = $rootScope.$new();
	       	auth = _auth_;
	    }));

	    it('should call authenticate with correct config argument', function() {
	    	var element = angular.element('<auth-private><div></div></auth-private>');
	    	$compile(element)(scope);
	    	scope.$digest()
	    	expect(auth.authenticate).toHaveBeenCalledWith({ 
	    		mandatory: true, 
	    		fallback_state: {
	    			name: 'test-fallback-state'
	    		}, 
	    		fallback_state_params: {
	    			test_param: 'test-param'
	    		}
	    	});
	    });
	});
});