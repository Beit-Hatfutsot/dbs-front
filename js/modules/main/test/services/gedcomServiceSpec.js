'use strict';

ddescribe('gedcom', function() {
	var gedcom, apiClient, $httpBackend, cache, ftrees_search_url, query_url;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function(_gedcom_, _apiClient_, _$httpBackend_, _cache_) { 
		gedcom 			= _gedcom_;
		apiClient 		= _apiClient_;
		$httpBackend 	= _$httpBackend_;

		//$httpBackend.expectGET('templates/main/start.html').respond('');

		ftrees_search_url = apiClient.urls.ftrees_search;
		query_url = ftrees_search_url + '?&';
		$httpBackend.whenGET(query_url).
			respond(200, [
				
			]);
	}));

	
	it('should', function() {
		
	});
});
