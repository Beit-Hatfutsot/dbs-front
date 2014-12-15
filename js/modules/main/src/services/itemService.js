angular.module('main').
	factory('item', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		
		var in_progress = false;

		var itemClient = $resource(apiClient.urls.item +'/:items');

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
							itemClient.get({items: item_string}).$promise.
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

			get_related: function(items_arr) {
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
							var not_cached_items_string = parse_items_arr(not_cached_items);
							itemClient.query({items: not_cached_items_string}).$promise.
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