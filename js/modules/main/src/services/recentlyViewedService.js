angular.module('main').
	factory('recentlyViewed', ['$window', function($window) {
		var recent;
		var max_items = 50;

		if( $window.sessionStorage !== undefined ) {
			recent = $window.sessionStorage;
		}
		else {
			recent = {
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

		var recently_viewed = {
			items: JSON.parse(recent.getItem('recentlyViewed')) || [],

			put: function(item) {
				item._id = JSON.stringify(item.params);
				var recent_item = this.items.filter(function(recent_item) {
					return item._id == recent_item._id;
				})[0];
				if (!recent_item) {
					this.items.push(item);

					if (this.items.length > max_items) {
						this.items.splice(0, 1);
					}
					recent.setItem('recentlyViewed', JSON.stringify(this.items));
				}

			},

			clear: function() {
				this.items = [];
			}
		};

		return recently_viewed;
	}]);
