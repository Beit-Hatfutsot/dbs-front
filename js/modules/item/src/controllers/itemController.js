var ItemCtrl = function($stateParams, item) {
	var self = this;
	
	item.get($stateParams.id).then(function(item_data) {
		self.item_data = item_data;
	});
};

ItemCtrl.prototype = {

};

angular.module('item').controller('ItemCtrl', ['$stateParams', 'item', ItemCtrl]);
