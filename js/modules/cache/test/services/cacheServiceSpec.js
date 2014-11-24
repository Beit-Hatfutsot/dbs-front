'use strict';

describe('cache', function() {

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
			_id: { $oid: 'test_id' },
			data: 'test_data'
		};

		cache.put(item_data);
		retrieved = cache.get(item_data._id.$oid);

		expect(retrieved).toEqual(item_data);
	})
});