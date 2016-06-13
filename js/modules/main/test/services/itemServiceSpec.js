'use strict';

describe('item', function() {

	var item;

	beforeEach(function() {
		module('templates');
		module('main');
	});
	beforeEach(inject(function(_item_) {
		item = _item_;
	}));

	describe('local operations', function () {
		it('should parse the slug properly', function() {
			var slug = item.parse_state({collection: 'place', local_slug:'anyplace'});
			expect(slug.api).toEqual('place_anyplace');
			expect(slug.collection).toEqual('place');
			expect(slug.local_slug).toEqual('anyplace');
		});
		it('should use the english slug as default when both exists',
		   function () {
			var item_data = {'Slug': {'He': 'שלום', 'En': 'hello'}}
			expect(item.get_key(item_data)).toEqual('hello');
		});
		it('should use the hebrew slug when it is the only one',
		   function () {
			var item_data = {'Slug': {'He': 'שלום'}}
			expect(item.get_key(item_data)).toEqual('שלום');
		});
	})
	describe('single item networked operations', function () {
		var item_data, item_url, cache, $httpBackend, $timeout;

		beforeEach(inject(function(_cache_, _$httpBackend_, apiClient, _$timeout_) {
			cache = _cache_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;

			item_data = {
				Slug: {En: 'place_non-cached-id'},
				data: 'non-cached-data',
				UnitType: 5 //place
			};

			item_url = apiClient.urls.item + '/place_non-cached-id';
			$httpBackend.whenGET(item_url).
				respond(200, [item_data]);
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
		*/

		it('should fetch item from server', function() {
			var retrieved;

			cache.clear();
			$httpBackend.expectGET(item_url);

			item.get(item_data.Slug.En).
				then(function(data) {
					expect(data.Slug.En).toEqual(item_data.Slug.En);
				});
			$httpBackend.flush();

		});
		/* TODO: enable cache
		it('should use the cache to return the item when reading it twice', function() {
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

	}),
	describe('single item networked operations', function () {
		var $httpBackend, $timeout, apiClient;
		beforeEach(inject(function(_$httpBackend_, _apiClient_, _$timeout_) {
			apiClient = _apiClient_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		}));
		it('should fetch items from server', function() {
			var retrieved, items_url;
			var slugs = ['place_paris', 'place_amsterdam', 'place_london', 'place_rome'];
			var items_data = [];
			for (var i=0; i < slugs.length; i++)
				items_data.push({
					Slug: {En: slugs[i]},
					data: 'bla bla bla',
					UnitType: 5 //place
				});

			items_url = apiClient.urls.item + '/'+slugs.join(',');
			$httpBackend.whenGET(items_url).
				respond(200, items_data);

			$httpBackend.expectGET(items_url);

			item.get_items(slugs).
				then(function(data) {
					expect(data.length).toEqual(slugs.length);
				});
			$httpBackend.flush();

		});
	});
});
