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
				individuals: [
					{
						FN: 'Mr',
						LN: 'Vampire',
						BD: '1.1.1070',
						DD: '1.1.1995', 
						MP: 'Transilvania'
					},
					{
						FN: 'Mrs',
						LN: 'Vampire',
						BD: '1.1.1010',
						MP: 'Transilvania'
					},
					{
						FN: 'foo',
						LN: 'bar',
						MP: 'Tel Aviv'
					}
				]
			});

		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'test-name',
			place:'test-place'
		};
		wizard.search();
		$httpBackend.flush();
	}));

	
	it('should wizard search, set result & search status', function() {
		expect(wizard.result.name.header).toEqual('test-name');
		expect(wizard.result.place.header).toEqual('test-place');
	});

	it('should set search status', function() {
		expect(wizard.search_status).toEqual('bingo');

		wizard.clear();

		query_url = wizard_search_url + '?name=test-name&place=non-existing-place';
		$httpBackend.whenGET(query_url).
			respond(200, {
				name: {
					header:'test-name', 
					_id: 'name-id'
				}, 
				place: {},
				individuals: {}
			});
		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'test-name',
			place:'non-existing-place'
		};
		wizard.search();
		$httpBackend.flush();
		expect(wizard.search_status).toEqual('bingo-name');

		wizard.clear();

		query_url = wizard_search_url + '?name=non-existing-name&place=test-place';
		$httpBackend.whenGET(query_url).
			respond(200, {
				name: {}, 
				place: {
					header: 'test-place', 
					_id: 'place-id'
				},
				individuals: {}
			});
		$httpBackend.expectGET(query_url);
		wizard.query = {
			name: 'non-existing-name',
			place:'test-place'
		};
		wizard.search();
		$httpBackend.flush();
		expect(wizard.search_status).toEqual('bingo-place');
	});

	it('should filter live individual data', function() {
		expect(wizard.result.individuals[0].MP).toBe('Transilvania');
		expect(wizard.result.individuals[1].MP).toBe('Transilvania');
		expect(wizard.result.individuals[2].FN).toBe('foo');
		expect(wizard.result.individuals[2].MP).toBeNull;
	});

	it('should cache search results', function() {
		expect(cache.get('name-id').header).toEqual('test-name');
		expect(cache.get('place-id').header).toEqual('test-place');
	});

	it('should save last_search input', function() {
		expect(wizard.last_search.name).toEqual('test-name');
		expect(wizard.last_search.place).toEqual('test-place');
	});
});
