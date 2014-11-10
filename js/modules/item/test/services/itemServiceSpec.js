'use strict';

describe('item-service', function() {

	var item, item_data, item_url, cache, $httpBackend, $timeout;

	beforeEach(function() {
		module('ngResource');
		module('apiClient');
		module('cache');
		module('item');
	});

	beforeEach(inject(function(_item_, _cache_, _$httpBackend_, apiClient, _$timeout_) {
		item = _item_;
		cache = _cache_;
		$httpBackend = _$httpBackend_;
		$timeout = _$timeout_;

		item_data = {
			_id: 'test-id',
			data: 'test-data'
		};

		item_url = apiClient.urls.item + '/non-cached-id';
		$httpBackend.whenGET(item_url).
			respond(200, {
				item_data: {
					_id: 'non-cached-id',
					data: 'non-cached-data'
				}
			});
	}));

	it('should fetch items from cache', function() {
		var retrieved;

		cache.write(item_data);

		item.get(item_data._id).
			then(function(data) {
				retrieved = data;
			}); 
		$timeout.flush();

		expect(retrieved).toEqual(item_data);
	});

	it('should fetch items from server', function() {
		var result;

		$httpBackend.expectGET(item_url);

		item.get('non-cached-id').
			then(function(response) {
				result = response;
			});
		$httpBackend.flush();

		expect(result._id).toEqual('non-cached-id');

		result = {};
		item.get('non-cached-id').
			then(function(response) {
				result = response;
			});
		$timeout.flush();

		expect(result._id).toEqual('non-cached-id');
	});
});