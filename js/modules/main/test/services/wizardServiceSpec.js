'use strict';

ddescribe('wizard', function() {
	var wizard, apiClient, $httpBackend, wizard_search_url, query_url, cache;

	beforeEach(function() {
		module('main');
		module('templates')
	});

	beforeEach(inject(function(_wizard_, _apiClient_, _$httpBackend_, _cache_) { 
		wizard 			= _wizard_;
		apiClient 		= _apiClient_;
		$httpBackend 	= _$httpBackend_;
		cache 			= _cache_;

		wizard_search_url = apiClient.urls.wizard_search;
		query_url = wizard_search_url + '?name=test-name&place=test-place';
		$httpBackend.whenGET(query_url).
			respond(200, {
				name: {
					header:'test-name', 
					_id: 'name-id'
				}, 
				place: {
					header: 'test-place', 
					_id: 'place-id'
				},
				individuals: {}
			});
	}));

	
	it('should wizard search', function() {
		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'test-name',
			place:'test-place'
		};
		wizard.search();
		$httpBackend.flush();

		expect(wizard.result.name.header).toEqual('test-name');
		expect(wizard.result.place.header).toEqual('test-place');
	});


	it('should cache search results', function() {
		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'test-name',
			place:'test-place'
		};
		wizard.search();
		$httpBackend.flush();

		expect(cache.get('name-id').header).toEqual('test-name');
		expect(cache.get('place-id').header).toEqual('test-place');
	});

	it('should save last_search input', function() {
		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'test-name',
			place:'test-place'
		};
		wizard.search();
		$httpBackend.flush();

		expect(wizard.last_search.name).toEqual('test-name');
		expect(wizard.last_search.place).toEqual('test-place');
	});
});
