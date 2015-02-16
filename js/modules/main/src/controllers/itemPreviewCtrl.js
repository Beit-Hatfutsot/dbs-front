var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, notification) {
    this.$state = $state;
    this.$scope = $scope;
    this.mjs = mjs;
    this.notification = notification;

    this.collection_name = itemTypeMap.get_collection_name($scope.previewData);
    $scope.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
    	var collection_name = this.collection_name;
    	var item_string = collection_name + '.' + item_data._id; 
        this.$state.go('item-view', {item_string: item_string});
    },

    remove_from_mjs: function($event) {
    	$event.stopPropagation();
    	
    	var self = this,
    		item_string = this.collection_name + '.' + this.$scope.previewData._id;

    	this.mjs.remove(item_string).
			then(function() {
				self.notification.put({
					en: 'Item removed',
					he: 'הפריט הוסר'
				});
			}, function() {
				self.notification.put({
					en: 'Failed to remove item',
					he: 'הסרת הפריט נכשלה'
				});
			});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', 'mjs', 'notification', ItemPreviewCtrl]);
