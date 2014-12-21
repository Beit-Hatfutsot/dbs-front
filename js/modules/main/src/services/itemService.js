angular.module('main').
	factory('item', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		
		var in_progress = false;

		var itemResource = $resource(apiClient.urls.item +'/:items');

		var item_service = {

			get: function(item_string) {
				if ( !in_progress ) {
					var self 		= this,
						deferred	= $q.defer(),
						item_id		= item_string.split('.')[1],
						cached		= cache.get(item_id); 
					
					if (cached.isNotEmpty()) {
						deferred.resolve(cached);
					} 
					else {
						try {
							itemResource.get({items: item_string}).$promise.
								then(function(item_data) {
									cache.put(item_data);
									deferred.resolve(item_data);
								},
								function() {
									deferred.reject();
								}).
								finally(function() {
									in_progress = false;
								});
						}
						catch(e) {
							deferred.reject();
						}
					}

					return deferred.promise;
				}
			},

			get_items: function(items_arr) {
				if ( !in_progress ) {
					var self 				= this,
						deferred			= $q.defer(),
						cached_items		= [],
						not_cached_items	= [];

					items_arr.forEach(function(item_string) {
						var item_id	= item_string.split('.')[1],
							cached = cache.get(item_id);

						if (cached.isNotEmpty()) {
							cached_items.push(cached);
						}
						else {
							not_cached_items.push(item_string);
						}
					});

					if (not_cached_items.isEmpty()) {
						deferred.resolve(cached_items);
					} 
					else {
						try {
							// handle case when only one item is not cached.
							// the reason for this is that angular's $resource service needs to know whether the response is an array or an object.
							if (not_cached_items.length === 1) {
								self.get(not_cached_items[0]).then(function(item_data) {
									cache.put(item_data);
									deferred.resolve( cached_items.push(item_data) );
								});
							}
							else {
								var not_cached_items_string = parse_items_arr(not_cached_items);
								itemResource.query({items: not_cached_items_string}).$promise.
									then(function(item_data_arr) {
										item_data_arr.forEach(function(item_data) {
											cache.put(item_data);
										});
										deferred.resolve( item_data_arr.concat(cached_items) );
									},
									function() {
										deferred.reject();
									}).
									finally(function() {
										in_progress = false;
									});
							}
						}
						catch(e) {
							deferred.reject();
						}
					}

					return deferred.promise;
				}
			}
		};

		function parse_items_arr(items_arr) {
			var items_string = '';

			items_arr.forEach(function(item_string) {
				items_string += ',' + item_string;
			});

			return items_string.slice(1);
		}

		return item_service;
	}]);