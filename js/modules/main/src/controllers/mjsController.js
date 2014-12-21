var MjsController = function(mjs, notification, item, itemTypeMap) {
	var self = this;

	this.notification = notification;
	this.mjs = mjs;
	this.itemTypeMap = itemTypeMap;
	this.item = item;

	this.content_loaded = false;
	this.mjs_items = {
		assigned: [],
		unassigned: []
	};
	this.new_branch = {
		name: '+',
		items: []
	}

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
									items: self.sort_items([item_data])
								};
								self.mjs_items.assigned.push(b);
							});
					}
					else if (branch.items.length > 1) {
						item.get_items( branch.items ).
							then(function(item_data) {
								var b = {
									name: branch.name,
									items: self.sort_items(item_data)
								};
								//b.items = b.items.concat(item_data);
								self.mjs_items.assigned.push(b);
							});
					}
				});	
			}

			this.content_loaded = true;
		}
	},

	sort_items: function(item_arr) {
		var self = this,
			item_map = {};
		
		item_arr.forEach(function(item) {
			var type = self.itemTypeMap.get_type(item.UnitType);
			if (item_map[type]) {
				item_map[type].push(item);	
			}
			else {
				item_map[type] = [item];
			}
		});

		return item_map;
	},

	insertNewBranch: function() {
		if (this.mjs_items.assigned.length < 4) {

			var self = this;

			this.mjs_data.insertBranch(this.new_branch).
				then(function() {
					self.parse_mjs_data();
			});
		}
	},

	save_story: function() {
		var self = this,
			new_unassigned = [], 
			new_assigned = []; 

		this.mjs_items.unassigned.forEach(function(item) {
			new_unassigned.push(self.itemTypeMap.get_type(item.UnitType) + '.' + item._id);
		});

		this.mjs_items.assigned.forEach(function(branch) {
			var items = [];
			for (var collection in branch.items) {
				if (branch.items[collection] instanceof Array) {
					branch.items[collection].forEach(function(item) {
						items.push(self.itemTypeMap.get_type(item.UnitType) + '.' + item._id);
					});
				}
			}
			new_assigned.push({
				name: branch.name,
				items: items
			});
		});

		this.mjs_data.unassigned = new_unassigned;
		this.mjs_data.assigned = new_assigned;
		this.mjs_data.$put();
	}
};



angular.module('main').controller('MjsController', ['mjs', 'notification', 'item', 'itemTypeMap', MjsController]);
