'use strict';

describe('auth-services', function() {

	beforeEach(function() {
		module('ngResource');
		module('ui.bootstrap');
		module('ui.router');
		module('lang');
		module('apiClient');
		module('auth');
	});

	describe('authManager', function() {
		var authManager, apiClient, $httpBackend;

		beforeEach(inject(function(_authManager_, _apiClient_, _$httpBackend_) { 
			authManager 	= _authManager_;
			apiClient 		= _apiClient_;
			$httpBackend 	= _$httpBackend_;

			$httpBackend.whenPOST(apiClient.urls.auth).
				respond(function(method, url, data, headers) {
					var code, response,
						requestData = JSON.parse(data);
					
					if (requestData.email == 'test-username' && requestData.password == 'test-password') {
						
						response = {
							token: 'test-token'
						};

						code = 200;
					}
					else {

						response = {};

						code = 400;
					}		

					return [code, response];						
				});
		}));

		
		it('should signin', function() {
			
			$httpBackend.expectPOST(apiClient.urls.auth);

			authManager.signin('test-username', 'test-password');
			$httpBackend.flush();
			expect(authManager.signedin_user.name).not.toEqual('test-username');
		});


		it('should not signin', function() {
			
			$httpBackend.expectPOST(apiClient.urls.auth);

			authManager.signin('wrong-username', 'wrong-password');
			$httpBackend.flush();
			expect(authManager.signedin_user.name).not.toBeDefined();
		});
	});
});
