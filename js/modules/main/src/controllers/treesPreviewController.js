var TreesPreviewController = function($state, $scope, itemTypeMap, mjs, notification) {
    this.$state = $state;
    this.$scope = $scope;
    this.mjs = mjs;
    this.notification = notification;
};

TreesPreviewController.prototype = {

    goto_trees: function(query_params) { 
        this.$state.go('ftrees', query_params);
    },

    remove_from_mjs: function($event) {
    	$event.stopPropagation();
    	
    	var self = this,
    		item_string = this.$scope.item_type + '.' + this.$scope.previewData._id;

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

angular.module('main').controller('TreesPreviewController', ['$state', '$scope', 'itemTypeMap', 'mjs', 'notification', TreesPreviewController]);
