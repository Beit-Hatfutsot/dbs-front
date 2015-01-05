'use strict';

ddescribe('ftrees', function() {
	var ftrees, apiClient, $httpBackend, cache, ftrees_search_url, query_url;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function(_ftrees_, _apiClient_, _$httpBackend_, _cache_) { 
		ftrees 			= _ftrees_;
		apiClient 		= _apiClient_;
		$httpBackend 	= _$httpBackend_;
		cache 			= _cache_;

		$httpBackend.expectGET('templates/main/start.html').respond('');

		ftrees_search_url = apiClient.urls.ftrees_search;
		query_url = ftrees_search_url + '?&';
		$httpBackend.whenGET(query_url).
			respond(200, [
				
			]);
	}));

	
	it('should', function() {
		
	});
});
