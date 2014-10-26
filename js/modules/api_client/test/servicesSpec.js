'use strict';

describe('apiClient-services', function() {

	beforeEach(function() {
		module('apiClient')
	});

	describe('apiClient', function() {
		var apiClient;

		beforeEach(inject(function(_apiClient_) { 
			apiClient = _apiClient_;
		}));

		
		it('should return the api url', function() {
			expect(apiClient.urls).toBeDefined();
		});
	});
});
