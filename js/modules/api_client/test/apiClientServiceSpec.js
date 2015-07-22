'use strict';

describe('apiClient', function() {
	var apiClient;

	beforeEach(function() {
		module('apiClient')
	});

	beforeEach(inject(function(_apiClient_) { 
		apiClient = _apiClient_;
	}));

	
	it('should have a urls object', function() {
		expect(apiClient.urls).toBeDefined();
	});

	it('should have a base_url', function() {
		expect(apiClient.base_url).toBeDefined();
	});
});
