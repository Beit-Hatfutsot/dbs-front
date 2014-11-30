var ItemCtrl = function($stateParams, item, notification, itemTypeMap) {
	var self = this;

	this.in_progress = true;
	this.failed = false;
	
	notification.clear();

	Object.defineProperty(this, 'item_type', {
		get: function() {
			return itemTypeMap.get_type(this.item_data.UnitType)
		}
	})

	item.get($stateParams.id).
		then(function(item_data) {
			self.item_data = item_data;
		}, function() {
			self.failed = true;
		}).
		finally(function() {
			self.in_progress = false;
		});
};

ItemCtrl.prototype = {

};

angular.module('main').controller('ItemCtrl', ['$stateParams', 'item', 'notification', 'itemTypeMap', ItemCtrl]);
