'use strict';

ddescribe('cache', function() {

	var cache;

	beforeEach(function() {
		module('cache');
	});

	beforeEach(inject(function(_cache_) {
		cache = _cache_;
	}));

	it('should cache items by id & clear cache', function() {
		var item_data, retrieved;

		item_data = {
			_id: 'test_id',
			data: 'test_data'
		};

		cache.put(item_data);
		retrieved = cache.get(item_data._id);

		expect(retrieved).toEqual(item_data);

		cache.clear();
		retrieved = cache.get(item_data._id);
		expect(retrieved).toEqual({});
	});
});