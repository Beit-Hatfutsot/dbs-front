var MjsWidgetController = function($scope, mjs, itemTypeMap) {
	var self = this;

	this.mjs = mjs;
	
	this.in_mjs = false;

	Object.defineProperty(this, 'item', {
		get: function() {
			return $scope.item;
		}
	});
	
	$scope.$watch('item', function(newVal, oldVal) {
		if (newVal && !oldVal) {
			self.item_string = itemTypeMap.get_item_string(self.item);
			self.content_loaded = true; 
			self.in_mjs = self.mjs.in_mjs(self.item_string);
		}
	});
	
	window.mjsWidgetCtrl = this;
};

MjsWidgetController.prototype = {
	push_to_mjs: function() {
		if ( this.content_loaded && !(this.in_mjs) ) {
			var self = this;
			
			this.mjs.add(this.item_string).then(function() {
				self.in_mjs = true;
			});
		}
	},

	remove_from_mjs: function() {
		if (this.in_mjs && !(this.item.ugc)) {
			var self = this;		
			
			this.mjs.remove(this.item_string).then(function() {
				self.in_mjs = false;
			});
		}
	}
};

angular.module('main').controller('MjsWidgetController', ['$scope', 'mjs', 'itemTypeMap', MjsWidgetController]);