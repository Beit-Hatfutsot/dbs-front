var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, notification) {
    this.$state = $state;
    this.$scope = $scope;
    this.mjs = mjs;
    this.notification = notification;

    this.item_string = itemTypeMap.get_item_string($scope.previewData);
    $scope.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
};

ItemPreviewCtrl.prototype = {

    goto_item: function() { 
        if (this.$scope.previewData.GTN) {
            this.$state.go('ftree-item', {individual_id: this.$scope.previewData.II, tree_number: this.$scope.previewData.GTN});
        }
        else {
            this.$state.go('item-view', {item_string: this.item_string});
        }
    },

    remove_from_mjs: function($event) {
    	$event.stopPropagation();
    	
    	var self = this;

    	this.mjs.remove(self.item_string).
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
