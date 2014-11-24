'use strict';

describe('item', function() {

	var item, item_data, item_url, cache, $httpBackend, $timeout;

	beforeEach(function() {
		//module('ngResource');
		//module('apiClient');
		//module('cache');
		module('main');
	});

	beforeEach(inject(function(_item_, _cache_, _$httpBackend_, apiClient, _$timeout_) {
		item = _item_;
		cache = _cache_;
		$httpBackend = _$httpBackend_;
		$timeout = _$timeout_;

		$httpBackend.expectGET('templates/main/start.html').respond('');

		item_data = {
			_id: { $oid: 'test-id' },
			data: 'test-data'
		};

		item_url = apiClient.urls.item + '/non-cached-id';
		$httpBackend.whenGET(item_url).
			respond(200, {
				item_data: {
					_id: { $oid: 'non-cached-id' },
					data: 'non-cached-data'
				}
			});
	}));

	it('should fetch items from cache', function() {
		var retrieved;

		cache.put(item_data);

		item.get(item_data._id.$oid).
			then(function(data) {
				retrieved = data;
			}); 
		$timeout.flush();

		expect(retrieved).toEqual(item_data);
	});

	it('should fetch items from server', function() {
		var retrieved;

		cache.clear();
		$httpBackend.expectGET(item_url);

		item.get('non-cached-id').
			then(function(data) {
				retrieved = data;
			});
		$httpBackend.flush();

		expect(retrieved._id.$oid).toEqual('non-cached-id');

		retrieved = {};
		item.get('non-cached-id').
			then(function(data) {
				retrieved = data;
			});
		$timeout.flush();

		expect(retrieved._id.$oid).toEqual('non-cached-id');
	});
});