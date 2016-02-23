angular.module('main').
	factory('item', ['$resource', '$q', '$rootScope', 'apiClient', 'cache', 'itemTypeMap', '$state',
	function($resource, $q, $rootScope, apiClient, cache, itemTypeMap, $state) {
		
		var in_progress = false;

		var itemResource = $resource(apiClient.urls.item +'/:items');

		var item_service = {

			get_url: function (item_data) {
				if (item_data.url !== undefined) {
					return item_data.url;
				}
				if (item_data.params.hasOwnProperty('tree_number')) {
					return $state.href('ftree-view',
									   	{individual_id: item_data.params.node_id,
										 tree_number: item_data.params.tree_number});
				}
				else {
					return $state.href('item-view', item_data.params);
				}
			},
			
			get_string: function(collection_name, item_id) {
				return [collection_name, item_id].join('.');
			},

			get_data_string: function(item_data) {
				return itemTypeMap.get_item_string(item_data);
			},

			get: function(collection_name, item_id) {
				if ( !in_progress ) {
					var self 				= this,
						deferred			= $q.defer(),
						item_string 		= self.get_string(collection_name, item_id),
						cached				= cache.get(item_id, collection_name); 

					if (cached.isNotEmpty()) {
						$rootScope.$broadcast('item-loaded', cached);
						deferred.resolve(cached);
					} 
					else {
						try {
							itemResource.query({items: item_string}).$promise
								.then(function(item_data) {
									var collection_name = itemTypeMap.get_collection_name(item_data[0]);
									cache.put(item_data[0], collection_name);
									$rootScope.$broadcast('item-loaded', item_data[0]);
									deferred.resolve(item_data[0]);
								},
								function(error) {
									deferred.reject(error);
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
						if(!item_string) return;
						var item_string_split	= item_string.split('.'),
							collection_name 	= item_string_split[0],
							item_id				= item_string_split[1],
							cached 				= cache.get(item_id, collection_name);

						if (cached.isNotEmpty()) {
							cached_items.push(cached);
						}
						else {
							not_cached_items.push(item_string);
						}
					});

					if (not_cached_items.isEmpty()) {
						$rootScope.$broadcast('item-loaded', cached_items);
						deferred.resolve(cached_items);
					} 
					else {
						try {
							var not_cached_item_strings = parse_items_arr(not_cached_items);
							itemResource.query({items: not_cached_item_strings}).$promise.
								then(function(item_data_arr) {
									item_data_arr.forEach(function(item_data) {
										var collection_name = itemTypeMap.get_collection_name(item_data);
										cache.put(item_data, collection_name);
									});
									var ret = item_data_arr.concat(cached_items);
									$rootScope.$broadcast('item-loaded', ret);
									deferred.resolve(ret);
								},
								function() {
									deferred.resolve( cached_items );
									$rootScope.$broadcast('items-load');
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
