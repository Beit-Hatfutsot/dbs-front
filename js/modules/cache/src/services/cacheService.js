angular.module('cache').
	factory('cache', [function() {
		var cache, cached_items;

		if( window.sessionStorage !== undefined ) {
			cached_items = window.sessionStorage;
		}
		else {
			cached_items = {
				setItem: function(key, item) {
					this[key] = item;
				},

				getItem: function(key) {
					return this[key] || null;
				},

				clear: function() {
					for (key in this) {
						delete this[key];
					}
				}
			};
		}

		cache = {
			put: function(item) {
				if ( item._id !== undefined ) {
					return cached_items.setItem( item._id, JSON.stringify(item) );
				}
				return false;
			},

			get: function(item_id) {
				var cached_string = cached_items.getItem(item_id);
				return cached_string ? JSON.parse(cached_string) : {};
			},

			clear: function() {
				cached_items.clear();
			}
		};

		return cache;
	}]);