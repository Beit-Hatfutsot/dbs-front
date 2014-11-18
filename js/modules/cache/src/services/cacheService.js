angular.module('cache').
	factory('cache', [function() {
		var cache, cached_items = {},

		cache = {
			write: function(item) {
				if ( item.isNotEmpty() ) {
					cached_items[item._id.$oid] = angular.copy(item);
					return true;
				}
				return false;
			},

			read: function(item_id) {
				return cached_items[item_id] || null;
			}
		};

		return cache;
	}]);