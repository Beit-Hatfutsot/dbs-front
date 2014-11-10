'use strict';

describe('cache-service', function() {

	var cache;

	beforeEach(function() {
		module('cache');
	});

	beforeEach(inject(function(_cache_) {
		cache = _cache_;
	}));

	it('should cache items by id', function() {
		var item_data, retrieved;

		item_data = {
			_id: 'test_id',
			data: 'test_data'
		};

		cache.write(item_data);
		retrieved = cache.read(item_data._id);

		expect(retrieved).toEqual(item_data);
	})
});