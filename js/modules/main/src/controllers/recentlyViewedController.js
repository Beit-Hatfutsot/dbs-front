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
    		return this.view_index * -68;
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
            if (this.items.length > 14) {
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

    this.max_items_inscroll = 14;
    this.view_index = this.items.length > this.max_items_inscroll ? this.items.length - this.max_items_inscroll : 0;

    $scope.$watch(function() {return self.items.length}, function(newVal, oldVal) {
        if (newVal === oldVal + 1) {
            self.scroll_right();
        }
    });
};	

RecentlyViewedController.prototype = {
	goto_item: function(item_data) {
    	var collection_name = this.itemTypeMap.get_collection_name(item_data);;
        this.$state.go('item-view', {collection: collection_name,
					   			     id: item_data._id});
    },

    scroll_left: function() {
        if (this.can_scroll_left) {
        	this.view_index--;
        }
    },

    scroll_right: function() {
    	if (this.can_scroll_right) {
            this.view_index++;
        }
    }
};

angular.module('main').controller('RecentlyViewedController', ['$scope', '$state', 'recentlyViewed', 'itemTypeMap', 'langManager', RecentlyViewedController]);

