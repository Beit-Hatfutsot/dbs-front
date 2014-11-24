'use strict';

describe('apiClient', function() {
	var apiClient;

	beforeEach(function() {
		module('apiClient')
	});

	beforeEach(inject(function(_apiClient_) { 
		apiClient = _apiClient_;
	}));

	
	it('should return the api url', function() {
		expect(apiClient.urls).toBeDefined();
	});
});
