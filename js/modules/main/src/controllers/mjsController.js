var MjsController = function($scope, mjs, notification, item, itemTypeMap, plumbConnectionManager, header, langManager) {
	var self = this;

	header.sub_header_state = 'closed';

	this.notification = notification;
	this.mjs = mjs;
	this.itemTypeMap = itemTypeMap;
	this.item = item;
	this.plumbConnectionManager = plumbConnectionManager;
	this.langManager = langManager;

	this.content_loaded = false;
	this.mjs_items = {
		assigned: [],
		unassigned: []
	};
	this.new_branch = {
		name: '+',
		items: []
	}
	this.selected_collection = [];
	this.parse_in_progress = false;
	this.dragging = false;
	this.branch_edit_status = {
		0: false,
		1: false,
		2: false,
		3: false,
	};
	this.branch_rmdialog_status = {
		0: false,
		1: false,
		2: false,
		3: false,
	};

	Object.defineProperty(this, 'mjs_data', {
		get: function() {
			return mjs.data;
		}
	});

	Object.defineProperty(this, 'selected_collection_type', {
		get: function() {
			return this.get_collection_type(this.selected_collection);
		}
	});

	$scope.$watch(function() {
		if (self.mjs_data.$resolved) {
			var unassigned_count = self.mjs_data.unassigned.length,
				branches_count = self.mjs_data.assigned.length,
				assigned_count = 0;

			self.mjs_data.assigned.forEach(function(branch) {
				assigned_count += branch.items.length;
			});

			return unassigned_count - assigned_count;
		}
	}, function(newVal, oldVal) {
		self.parse_mjs_data();
	});

	$scope.$watch(function() {
		if (self.mjs_data.$resolved) {
			var	branches_count = self.mjs_data.assigned.length;
			return branches_count;
		}
	}, function(newVal, oldVal) {
		self.parse_mjs_data();
	});



	/*************************************************************************/


	this.selected_branch = null;
	this.dragging = false;

	$scope.$on('dragstart', function() {
		$scope.$apply(function() {
			self.selected_branch = null;
			self.dragging = true;
		});
	});
	$scope.$on('dragend', function() {
		$scope.$apply(function() {
			self.dragging = false;
		});
	});
};

MjsController.prototype = {

	assign_item: function(branch_name, item) {
		var self = this,
			item_string = this.itemTypeMap.get_type(item.UnitType) + '.' + item._id;

		this.dragging = false;
		this.mjs.assign(branch_name, item_string).then(function() {
			self.select_branch_by_name(branch_name);
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

	remove_item: function(item_string) {
		
	},

	parse_mjs_data: function() {
		var self = this,
			item = this.item,
			mjs_data = this.mjs_data;

		this.select_collection([]);
		this.mjs_items.unassigned = [];
		this.mjs_items.assigned = [];

		if (mjs_data.hasOwnProperty('unassigned') || mjs_data.hasOwnProperty('assigned')) {
			if (mjs_data.unassigned.length === 1) {
				item.get( mjs_data.unassigned[0] ).
					then(function(item_data) {
						self.mjs_items.unassigned = [item_data];
					});
			}
			else if (mjs_data.unassigned.length > 1) {
				item.get_items( mjs_data.unassigned ).
					then(function(item_data) {
						self.mjs_items.unassigned = item_data;
					});	
			}

			if (mjs_data.assigned.length > 0) {
				mjs_data.assigned.forEach(function(branch) {
					if (branch.items.length === 1) {
						var b = {
							name: branch.name,
							items: {}
						};
						self.mjs_items.assigned.push(b);
						item.get( branch.items[0] ).
							then(function(item_data) {
								b.items = self.sort_items([item_data]);
							});
					}
					else if (branch.items.length > 1) {
						var b = {
							name: branch.name,
							items: {}
						};
						self.mjs_items.assigned.push(b);
						item.get_items( branch.items ).
							then(function(item_data) {
								b.items = self.sort_items(item_data)	;
							});
					}
					else {
						var b = {
							name: branch.name,
							items: []
						};
						self.mjs_items.assigned.push(b); 
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

	insert_new_branch: function() {
		if (this.mjs_items.assigned.length < 4) {			
			var self = this;

			this.mjs.add_branch(this.new_branch.name).
				then(function() {
					self.new_branch = {
						name: '+',
					}
			});
		}
	},

	remove_branch: function($event, branch_name) {
		var self = this;
		$event.stopPropagation();
		this.select_branch(this.selected_branch);
		this.mjs.remove_branch(branch_name).
			then(function() {
				//notify of success
			});
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
	},

	select_collection: function(collection) {
		this.selected_collection = collection;
	},

	is_selected_collection: function(item_arr) {
		var result = true;

		if (this.selected_collection.length != item_arr.length) {
			return false;
		}

		this.selected_collection.forEach(function(item, index) {
			if (item._id !== item_arr[index]._id) {
				result = false;
			}
		});

		return result;
	},

	select_branch: function(branch_index) {
		var self = this;

		if (this.selected_branch == branch_index) {
			this.selected_branch = null;
		}
		else{
			this.selected_branch = branch_index;
		}
		this.select_collection([]);
		
		var repaint = setInterval(function() {
			self.plumbConnectionManager.connections['molecules-main'].plumb.repaintEverything();
		}, 100);
		setTimeout(function() {
			clearInterval(repaint);
		}, 1000);
	},

	select_branch_by_name: function(branch_name) {
		var branch = this.mjs_items.assigned.filter(function(branch, index) {
			return branch.name == branch_name;
		})[0];

		var index = this.mjs_items.assigned.indexOf(branch);

		this.select_branch(index);
	},

	stopPropagation: function($event) {
		$event.stopPropagation();
	},

	create_n_assign: function(branch_name, item) {
		this.dragging = false;
		branch_name = 'new branch';
		this.new_branch.name = branch_name;
		this.insert_new_branch();	
		this.assign_item(branch_name, item);
	},

	remove: function($event, branch_name) {
		this.remove_branch($event, branch_name);
		this.selected_branch = null;
		for (var index in this.branch_edit_status) {
			this.branch_edit_status[index] = false;
		}
		for (var index in this.branch_rmdialog_status) {
			this.branch_rmdialog_status[index] = false;
		}
	},

	toggle_branch_edit: function($event, index)  {
		$event.preventDefault();
	    $event.stopPropagation();
		this.branch_edit_status[index] = !(this.branch_edit_status[index]); 
	},

	toggle_branch_rmdialog: function($event, index)  {
		$event.preventDefault();
	    $event.stopPropagation();
		this.branch_rmdialog_status[index] = !(this.branch_rmdialog_status[index]); 
	},

	get_collection_type: function(collection) {
		if (collection.length > 0) {
			var display_type_map = {
				'familyNames': {
					en: 'Family Names',
					he: 'שמות משפחה'
				},
				'places': {
					en: 'Places',
					he: 'מקומות'
				}
			};
			var type = this.itemTypeMap.get_type(collection[0].UnitType);
			var display_type = display_type_map[type][this.langManager.lang];
			
			return display_type ;
		}
		else {
			return '';
		}
	}
};

angular.module('main').controller('MjsController', ['$scope', 'mjs', 'notification', 'item', 'itemTypeMap', 'plumbConnectionManager', 'header', 'langManager', MjsController]);
