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

			$httpBackend.whenGET(apiClient.urls.auth).respond();
			$httpBackend.whenGET('templates/auth/auth_modal.html').respond();
			$httpBackend.whenPOST(apiClient.urls.auth).
				respond(function(method, url, data, headers) {
					var code, response,
						requestData = JSON.parse(data);
					
					if (requestData.email == 'test-username' && requestData.password == 'test-password') {
						
						response = {
							meta: {
								code: 200
							},
							response: {
								user: { 
									name: 'test' 
								}
							}
						}

						code = 200;
					}
					else {

						response = {
							meta: {
								code: 400
							}
						}

						code = 400;
					}		

					return [code, response];						
				});
		}));

		
		it('should signin', function() {
			
			$httpBackend.expectGET(apiClient.urls.auth);
			$httpBackend.expectPOST(apiClient.urls.auth);

			authManager.signin('test-username', 'test-password').
				then(function(response) {
					expect(response.response.user.name).toEqual('test');
				});
			$httpBackend.flush();
			expect(authManager.signedin_user.name).toEqual('test');
		});


		it('should not signin', function() {
			
			$httpBackend.expectGET(apiClient.urls.auth);
			$httpBackend.expectPOST(apiClient.urls.auth);

			authManager.signin('wrong-username', 'wrong-password');
			$httpBackend.flush();
			expect(authManager.signedin_user.name).not.toBeDefined();
		});
	});
});
