'use strict';

describe('search-services', function() {

	beforeEach(function() {
		module('ngResource');
		module('apiClient');
		module('search');
	});

	describe('searchManager', function() {
		var searchManager, apiClient, $httpBackend, wizard_search_url, query_url;

		beforeEach(inject(function(_searchManager_, _apiClient_, _$httpBackend_) { 
			searchManager 	= _searchManager_;
			apiClient 		= _apiClient_;
			$httpBackend 	= _$httpBackend_;

			wizard_search_url = apiClient.urls.search + '/wizard';
			query_url = wizard_search_url + '?name=test-name&place=test-place';
			$httpBackend.whenGET(query_url).
				respond(200, {
					names: [{header:'test-name'}], 
					places: [{header: 'test-place'}]
				});
		}));

		
		it('should wizard search', function() {
			var result;
			
			$httpBackend.expectGET(query_url);

			searchManager.wizard_search('test-name', 'test-place').
				then(function(response) {
					result = response;
					console.log(response)
				});
			$httpBackend.flush();

			expect(result.names[0].header).toEqual('test-name');
			expect(result.places[0].header).toEqual('test-place');
		});
	});
});
