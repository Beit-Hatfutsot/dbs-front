angular.module('cache').
	factory('cache', ['$window', function($window) {
		var cache, cached_items;

		if( $window.sessionStorage !== undefined ) {
			cached_items = $window.sessionStorage;
		}
		else {

			/**
			 * @ngdoc object
			 * @name cached_items
			 *
			 * @description
			 * A private object of the {@link module:cache.service:cache} service. 
			 * Serves as a fallback cache mechanism when the `window.sessionStorage` is not defined.
			 * It implements some methods from the `sessionStorage` API.
			 */
			cached_items = {

				/**
				 * @ngdoc method
				 * @name cached_items#setItem
				 * 
				 * @description
				 * Stores an item in cache.
				 *
				 * @param {String} key Key for the cached object
				 * @param {Object} item 
				 * Cached object. 
                 * Note that while it is possible to cache any type of object,
                 * the original `sessionStorage` method will only work with String.
				 */
				setItem: function(key, item) {
					this[key] = item;
				},

				/**
				 * @ngdoc method
				 * @name cached_items#getItem
				 * 
				 * @description
				 * Retrieves an item from cache.
				 *
				 * @param {String} key Key of the cached object
				 *
				 * @returns {Object} Cached object. Note that the original `sessionStorage` method returns a string.
				 */
				getItem: function(key) {
					return this[key] || null;
				},

				/**
				 * @ngdoc method
				 * @name cached_items#clear
				 *
				 * @description
				 * Clears cache.
				 */
				clear: function() {
					for (key in this) {
						delete this[key];
					}
				}
			};
		}

		/**
		 * @ngdoc service
		 * @name cache
		 *
		 * @description
		 * Custom cache service.
		 * The cache service uses browser's sessionStorage if available,
		 * and falls back to storing cached object ({@link cached_items}) in memory, if not. 
		 */
		cache = {
			
			/**
			 * @ngdoc method
			 * @name cache#put
			 *
			 * @description
			 * Store an item in cache, using its collection name & id to generate a unique (cache) key.
			 * 
			 * @param {Object} item Item to cache
			 * @param {String} collection Collection name of the cached item
			 *
			 * @returns `false` if item has no `_id` property, `undefined` otherwise.
			 */
			put: function(item, collection) {
				if ( item._id !== undefined ) {
					if (collection) {
						return cached_items.setItem( collection + ';' + item._id, JSON.stringify(item) );
					}
					else {
						return cached_items.setItem( item._id, JSON.stringify(item) );	
					}
				}
				return false;
			},

			/**
			 * @ngdoc method
			 * @name cache#get
			 *
			 * @description
			 * Get an item from cache.
			 * 
			 * @param {String} item_id Item id that was used when storing the item in cache.
			 * @param {String} collection Collection name of the cached item
			 *
			 * @returns {Object} Cahced item or `{}` if item was not found.
			 */
			get: function(item_id, collection) {
				var cached_string;

				if (collection) {
					cached_string = cached_items.getItem(collection + ';' + item_id);
				}
				else {
					cached_string = cached_items.getItem(item_id);
				}
				return cached_string ? JSON.parse(cached_string) : {};
			},

			/**
			 * @ngdoc method
			 * @name cache#clear
			 *
			 * @description
			 * Clear cache.
			 */
			clear: function() {
				cached_items.clear();
			}
		};

		return cache;
	}]);
