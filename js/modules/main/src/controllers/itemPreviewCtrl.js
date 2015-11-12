var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, notification, $window) {
    this.$state = $state;
    this.$window = $window;
    this.mjs = mjs;
    this.$scope = $scope;
    this.notification = notification;
    this.item_string = itemTypeMap.get_item_string($scope.previewData);
    this.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
    this.url = $scope.previewData.url;
    this.collection_name = itemTypeMap.get_collection_name($scope.previewData);
};

ItemPreviewCtrl.prototype = {

    goto_item: function() {
        console.log(this);
        if (this.url !== undefined) {
            this.$window.open(this.url);
            return;
        }
        if (this.collection_name === 'genTreeIndividuals') {
            this.$state.go('ftree-item', {individual_id: this.$scope.previewData.II, tree_number: this.$scope.previewData.GTN});
        }
        else {
			var parts = this.item_string.split('.')
			this.$state.go('item-view', {collection: parts[0], id: parts[1]});
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

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', 'mjs', 'notification', '$window', ItemPreviewCtrl]);
