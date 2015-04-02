angular.module('main').
	factory('item', ['$resource', '$q', '$rootScope', 'apiClient', 'cache',
	function($resource, $q, $rootScope, apiClient, cache) {
		
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
						$rootScope.$broadcast('item-load');
					} 
					else {
						try {
							itemResource.query({items: item_string}).$promise.
								then(function(item_data) {
									cache.put(item_data);
									deferred.resolve(item_data[0]);
									$rootScope.$broadcast('item-load');
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
						$rootScope.$broadcast('items-load');
					} 
					else {
						try {
							var not_cached_item_strings = parse_items_arr(not_cached_items);
							itemResource.query({items: not_cached_item_strings}).$promise.
								then(function(item_data_arr) {
									item_data_arr.forEach(function(item_data) {
										cache.put(item_data);
									});
									deferred.resolve( item_data_arr.concat(cached_items) );
									$rootScope.$broadcast('items-load');
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