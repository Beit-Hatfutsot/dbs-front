'use strict';

describe('wizard', function() {
	var wizard, apiClient, $httpBackend, wizard_search_url, query_url, cache;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function(_wizard_, _apiClient_, _$httpBackend_, _cache_) { 
		wizard 			= _wizard_;
		apiClient 		= _apiClient_;
		$httpBackend 	= _$httpBackend_;
		cache 			= _cache_;

		$httpBackend.expectGET('templates/main/start.html').respond('');

		wizard_search_url = apiClient.urls.wizard_search;
		query_url = wizard_search_url + '?name=test-name&place=test-place';
		$httpBackend.whenGET(query_url).
			respond(200, {
				bingo: {
					name: {
						header:'test-name', 
						_id: { $oid: 'name-id' }
					}, 
					place: {
						header: 'test-place', 
						_id: { $oid: 'place-id' }
					}
				}
			});
	}));

	
	it('should wizard search', function() {
		$httpBackend.expectGET(query_url);

		wizard.search('test-name', 'test-place')
		$httpBackend.flush();

		expect(wizard.result.bingo.name.header).toEqual('test-name');
		expect(wizard.result.bingo.place.header).toEqual('test-place');
	});


	it('should cache search results', function() {
		$httpBackend.expectGET(query_url);

		wizard.search('test-name', 'test-place')
		$httpBackend.flush();

		expect(cache.get('name-id').header).toEqual('test-name');
		expect(cache.get('place-id').header).toEqual('test-place');
	});
});
