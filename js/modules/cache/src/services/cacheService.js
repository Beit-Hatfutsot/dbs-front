angular.module('cache').
	factory('cache', [function() {
		var cache, cached_items = {},

		cache = {
			write: function(item) {
				if (item) {
					cached_items[item._id] = angular.copy(item);
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