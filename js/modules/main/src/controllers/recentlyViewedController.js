var RecentlyViewedController = function($scope, $state, recentlyViewed, itemTypeMap, langManager) {
    var self = this;

	this.$state = $state;
	this.itemTypeMap = itemTypeMap;

	Object.defineProperty(this, 'items', {
		get: function() {
			return recentlyViewed.items;
		}
	});

    Object.defineProperty(this, 'scroll_offset', {
    	get: function() {
    		return this.view_index * -84;
    	}
    });

    Object.defineProperty(this, 'scroll_style', {
        get: function() {
            if (langManager.lang === 'en') {
                return {left: this.scroll_offset + 'px'};
            }
            else if (langManager.lang === 'he') {
                return {right: this.scroll_offset + 'px'};
            }
        }
    });

    Object.defineProperty(this, 'show_arrows', {
        get: function() {
            if (this.items.length > 13) {
                return true;
            }
            return false;
        }
    });

    Object.defineProperty(this, 'can_scroll_left', {
        get: function() {
            return this.view_index > 0;
        }
    });

    Object.defineProperty(this, 'can_scroll_right', {
        get: function() {
            return this.view_index < this.items.length - this.max_items_inscroll;
        }
    });

    this.max_items_inscroll = 13;
    this.view_index = this.items.length > this.max_items_inscroll ? this.items.length - this.max_items_inscroll : 0;

    $scope.$watch(function() {return self.items.length}, function(newVal, oldVal) {
        if (newVal === oldVal + 1) {
            self.scroll_right();
        }
    });
};

RecentlyViewedController.prototype = {
	goto_item: function(item_data) {
        this.$state.go(item_data.state, item_data.params);
    },

    scroll_left: function() {
        if (this.can_scroll_left) {
            var next_index = this.view_index - 12;
            next_index >= 0 ? this.view_index = next_index : this.view_index = 0;
        }
    },

    scroll_right: function() {
    	if (this.can_scroll_right) {
            var next_index = this.view_index + 12;
            var last_index = this.items.length - this.max_items_inscroll;
            next_index >= last_index? this.view_index = last_index : this.view_index = next_index;
        }
    }
};

angular.module('main').controller('RecentlyViewedController', ['$scope', '$state', 'recentlyViewed', 'itemTypeMap', 'langManager', RecentlyViewedController]);

