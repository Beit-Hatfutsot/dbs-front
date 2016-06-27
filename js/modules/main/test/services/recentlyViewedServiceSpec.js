'use strict';

describe('recentlyViewedService', function() {

	var service,
		storage;

	beforeEach(function() {
		module('bhsclient-templates');
		module('main');
	});
	beforeEach(inject(function(recentlyViewed, _$window_) {
		service = recentlyViewed;
		storage = _$window_.sessionStorage;
	}));

	it("should clear the storage when it's bad", function() {
		var item_data = {'Slug': {'He': 'שלום', 'En': 'hello'}},
			bad_storage = [{'bad': 'storage'}];
		storage.setItem('recentlyViewed', JSON.stringify(bad_storage));
		service.put(item_data);
		expect(JSON.parse(storage.getItem('recentlyViewed'))).
			   toEqual([item_data]);
	})
});

