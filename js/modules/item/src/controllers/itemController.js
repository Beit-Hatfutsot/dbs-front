var ItemCtrl = function($stateParams, item) {
	var self = this;

	this.in_progress = true;
	this.failed = false;
	
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

angular.module('item').controller('ItemCtrl', ['$stateParams', 'item', ItemCtrl]);
