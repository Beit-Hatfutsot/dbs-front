'use strict';

describe('item', function() {

	var item, item_data, item_url, cache, $httpBackend, $timeout;

	beforeEach(function() {
		module('templates');
		module('main');
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

		item_url = apiClient.urls.item + '/places.non-cached-id';
		$httpBackend.whenGET(item_url).
			respond(200, [{
				_id: 'non-cached-id',
				data: 'non-cached-data',
				UnitType: 5 //place
			}]);
	}));

	/* TODO: enable the cache
	it('should fetch items from cache', function() {
		var retrieved;

		cache.put(item_data, 'test-collection');
		item.get('test-collection', item_data._id).
			then(function(data) {
				retrieved = data;
			}); 
		$timeout.flush();

		expect(retrieved).toEqual(item_data);
	});

	it('should fetch items from server, & cache them', function() {
		var retrieved;

		cache.clear();
		$httpBackend.expectGET(item_url);

		item.get('places', 'non-cached-id').
			then(function(data) {
				retrieved = data;
			});
		$httpBackend.flush();

		expect(retrieved._id).toEqual('non-cached-id');

		retrieved = {};
		item.get('places' ,'non-cached-id').
			then(function(data) {
				retrieved = data;
			});
		$timeout.flush();

		expect(retrieved._id).toEqual('non-cached-id');
		$httpBackend.verifyNoOutstandingRequest();
	});
	*/
});
