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
				var recent_item = this.items.filter(function(recent_item) {
					return item._id == recent_item._id;
				})[0];
				if (recent_item) {
					var index = this.items.indexOf(recent_item);
					this.items.splice(index, 1);
				}
				else if (this.items.length > max_items) {
					this.items.splice(0, 1);
				}

				this.items.push(item);
				
				recent.setItem('recentlyViewed', JSON.stringify(this.items));
			},

			clear: function() {
				this.items = [];
			}
		};

		return recently_viewed;
	}]);