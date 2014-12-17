var MjsController = function(mjs, notification) {
	var self = this;

	this.notification = notification;
	this.mjs = mjs;

	this.selected_branch = null;

	Object.defineProperty(this, 'mjs_data', {
		get: function() {
			return mjs.data;
		}
	});
};

MjsController.prototype = {
	select_branch: function(branch_index) {
		if (this.selected_branch == branch_index) {
			this.selected_branch = null;
		}
		else{
			this.selected_branch = branch_index;
		}
	},

	select_mjs_item: function($event) {
	
	},

	assign_item: function(branch_name, item_string) {
		var self = this;

		this.mjs.assign(branch_name, item_string).then(function() {
			self.notification.put({
				en: 'Item added to branch ' + branch_name + ' successfuly',
				he: 'הפריט הוסף לענף ' + branch_name +  ' בהצלחה'
			});
		}, function() {
			self.notification.put({
				en: 'Failed to add item',
				he: 'הוספת הפריט נכשלה'
			});
		});
	}
};

angular.module('main').controller('MjsController', ['mjs', 'notification', MjsController]);