var MjsController = function(mjs, notification, item, itemTypeMap) {
	var self = this;

	this.notification = notification;
	this.mjs = mjs;
	this.itemTypeMap = itemTypeMap;
	this.item = item;

	this.selected_branch = null;
	this.mjs_items = {
		assigned: [],
		unassigned: []
	};

	Object.defineProperty(this, 'mjs_data', {
		get: function() {
			return mjs.data;
		}
	});

	this.mjs_data.$promise.
		then(function(mjs_data) {
			self.parse_mjs_data();	
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

	assign_item: function(branch_name, item) {
		var self = this,
			item_string = this.itemTypeMap.get_type(item.UnitType) + '.' + item._id;

		this.mjs.assign(branch_name, item_string).then(function() {
			self.parse_mjs_data();	
			self.notification.put({
				en: 'Item successfuly added to branch ' + branch_name,
				he: 'הפריט הוסף לענף ' + branch_name +  ' בהצלחה'
			});
		}, function() {
			self.notification.put({
				en: 'Failed to add item',
				he: 'הוספת הפריט נכשלה'
			});
		});
	},

	unassign_item: function(branch_name, item) {
		var self = this,
			item_string = this.itemTypeMap.get_type(item.UnitType) + '.' + item._id;

		this.mjs.unassign(branch_name, item_string).then(function() {
			self.parse_mjs_data();	
			self.notification.put({
				en: 'Item successfuly removed from branch ' + branch_name,
				he: 'הפריט הורד מענף ' + branch_name +  ' בהצלחה'
			});
		}, function() {
			self.notification.put({
				en: 'Failed to remove item from branch',
				he: 'הורדת הפריט מהענף נכשלה'
			});
		});
	},

	parse_mjs_data: function() {
		var self = this,
			item = this.item,
			mjs_data = this.mjs_data;

		this.mjs_items.unassigned = [];
		this.mjs_items.assigned = [];

		if (mjs_data.hasOwnProperty('unassigned') || mjs_data.hasOwnProperty('assigned')) {
			if (mjs_data.unassigned.length === 1) {
				item.get( mjs_data.unassigned[0] ).
					then(function(item_data) {
						self.mjs_items.unassigned.push(item_data);
					});
			}
			else if (mjs_data.unassigned.length > 1) {
				item.get_items( mjs_data.unassigned ).
					then(function(item_data) {
						self.mjs_items.unassigned = self.mjs_items.unassigned.concat(item_data);
					});	
			}

			if (mjs_data.assigned.length > 0) {
				mjs_data.assigned.forEach(function(branch) {
					if (branch.items.length === 1) {
						item.get( branch.items[0] ).
							then(function(item_data) {
								var b = {
									name: branch.name,
									items: [item_data]
								};
								self.mjs_items.assigned.push(b);
							});
					}
					else if (branch.items.length > 1) {
						item.get_items( branch.items ).
							then(function(item_data) {
								var b = {
									name: branch.name,
									items: []
								};
								b.items = b.items.concat(item_data);
								self.mjs_items.assigned.push(b);
							});
					}
				});	
			}
		}
	}
};



angular.module('main').controller('MjsController', ['mjs', 'notification', 'item', 'itemTypeMap', MjsController]);
