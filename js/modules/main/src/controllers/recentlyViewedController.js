var RecentlyViewedController = function($state, recentlyViewed, itemTypeMap) {
	var max_items_inscroll = 14;

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

    this.view_index = this.items.length > max_items_inscroll ? this.items.length - max_items_inscroll : 0;

    window.recentlyViewedCtrl = this;
};	

RecentlyViewedController.prototype = {
	goto_item: function(item_data) {
    	var collection_name = this.itemTypeMap.get_collection_name(item_data);;
    	var item_string = collection_name + '.' + item_data._id; 
        this.$state.go('item-view', {item_string: item_string});
    },

    scroll_left: function() {
    	this.view_index++;
    },

    scroll_right: function() {
    	this.view_index--;
    }
};

angular.module('main').controller('RecentlyViewedController', ['$state', 'recentlyViewed', 'itemTypeMap', RecentlyViewedController]);

