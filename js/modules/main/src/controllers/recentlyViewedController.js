var RecentlyViewedController = function($state, recentlyViewed, itemTypeMap) {

	this.$state = $state;
	this.itemTypeMap = itemTypeMap;

	Object.defineProperty(this, 'items', {
		get: function() {
			return recentlyViewed.items;
		}
	});
};	

RecentlyViewedController.prototype = {
	goto_item: function(item_data) {
    	var collection_name = this.itemTypeMap.get_type(item_data.UnitType);;
    	var item_string = collection_name + '.' + item_data._id; 
        this.$state.go('item-view', {item_string: item_string});
    }
};

angular.module('main').controller('RecentlyViewedController', ['$state', 'recentlyViewed', 'itemTypeMap', RecentlyViewedController]);

