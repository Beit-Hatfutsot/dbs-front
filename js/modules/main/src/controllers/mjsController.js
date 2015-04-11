var MjsController = function($scope, $q, mjs, notification, item, itemTypeMap, plumbConnectionManager, header, langManager, auth, user) {
	var self = this;

	this.$q = $q;
	this.notification = notification;
	this.mjs = mjs;
	this.itemTypeMap = itemTypeMap;
	this.item = item;
	this.plumbConnectionManager = plumbConnectionManager;
	this.langManager = langManager;
	this.header = header;

	this.dragging = false;

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

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

	Object.defineProperty(this, 'molecules_top', {
		get: function() {
			if (this.selected_branch === 0 || this.selected_branch === 1) {
				return true;
			}

			return false;
		}
	});

	Object.defineProperty(this, 'molecules_bottom', {
		get: function() {
			if (this.selected_branch === 2 || this.selected_branch === 3) {
				return true;
			}

			return false;
		}
	});

	this.init();
	
	$scope.$watch(function() {
		return self.signedin;
	},
	function(signedin) {
		if (signedin) {
			mjs.refresh().
				then(function() {
					self.parse_mjs_data();
				});
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
	}, 
	function(newVal, oldVal) {
		if (newVal != oldVal) {
			self.parse_mjs_data();
		}
	});
	
	$scope.$watch(function() {
		if (self.mjs_data.$resolved) {
			var	branches_count = self.mjs_data.assigned.length;
			return branches_count;
		}
	}, 
	function(newVal, oldVal) {
		if (newVal != oldVal) {
			self.parse_mjs_data();
		}
	});
	
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
	init: function() {
		var self = this;

		this.header.sub_header_state = 'closed';
		this.content_loaded = false;
		this.mjs_items = {
			assigned: [],
			unassigned: []
		};
		this.new_branch = {
			name: 'new family branch'
		}
		this.selected_branch = null;
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

		this.notification.clear();
	},

	assign_item: function(branch_name, item) {
		var self = this,
			item_string = this.itemTypeMap.get_item_string(item);

		this.dragging = false;
		this.mjs.assign(branch_name, item_string).then(function() {
			var index = self.get_branch_index(branch_name);
			if (self.selected_branch !== index) {
				self.select_branch(index);
			}
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
			item_string = this.itemTypeMap.get_item_string(item);

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

	parse_mjs_data: function() {
		var self = this,
			item = this.item,
			mjs_data = this.mjs_data;

		this.notification.put({
			en: 'Parsing Story...',
			he: 'טוען סיפור...'
		});

		this.select_collection([]);
		this.mjs_items.unassigned = [];
		this.mjs_items.assigned = [];

		if (mjs_data.hasOwnProperty('unassigned') || mjs_data.hasOwnProperty('assigned')) {
			item.get_items( mjs_data.unassigned ).
				then(function(item_data) {
					self.mjs_items.unassigned = item_data;
				});	

			if (mjs_data.assigned.length > 0) {
				mjs_data.assigned.forEach(function(branch) {
					if (branch.items.length > 0) {
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
		}

		this.content_loaded = true;

		this.notification.put({
			en: 'Story loaded successfuly',
			he: 'סיפור נטען בהצלחה.'
		});
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
		var insert_deferred = this.$q.defer();

		if (this.mjs_items.assigned.length < 4) {			
			var self = this;
			var name = this.generate_unique_branch_name();

			this.mjs.add_branch(name).
				then(function() {
					var index = self.mjs_items.assigned.length-1;
					self.select_branch(index);
					self.branch_edit_status[index] = true;

					insert_deferred.resolve(name);
				}, 
				function() {
					insert_deferred.reject();
				});
		}
		else {
			insert_deferred.reject();
		}

		return insert_deferred.promise;
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
		}, 2500);
	},

	get_branch_index: function(branch_name) {
		var branch = this.mjs_items.assigned.filter(function(branch, index) {
			return branch.name == branch_name;
		})[0];
		var index = this.mjs_items.assigned.indexOf(branch);

		return index;
	},

	stopPropagation: function($event) {
		$event.stopPropagation();
	},

	create_n_assign: function(branch_name, item) {
		var self = this;

		this.dragging = false;
		this.insert_new_branch(branch_name).
			then(function(new_name) {
				self.assign_item(new_name, item);
			});	
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
				},
				'photoUnits': {
					en: 'Images',
					he: 'תמונות'
				},
				'genTreeIndividuals': {
					en: 'Family Trees',
					he: 'עצי משפחה'
				},
				'ugc': {
					en: 'Uploaded Items',
					he: 'פריטים שהועלו'
				},
				'default': {
					en: 'Unknown',
					hw: 'לא ידוע'
				}
			};

			var type = this.itemTypeMap.get_type(collection[0].UnitType);
			if (!type) {
				type = 'default';
			}
			try {
				var display_type = display_type_map[type][this.langManager.lang];
			}
			catch(e) {
				console.error('Could not find type: ' + type)
			}
			
			return display_type ;
		}
		else {
			return '';
		}
	},

	count_branches_named: function(name) {
		var count = 0;

		this.mjs_items.assigned.forEach(function(branch) {
			if (branch.name === name) {
				count++;
			}
		});

		return count;
	},

	is_duplicate_branch_name: function(name) {
		return this.count_branches_named(name) > 1;
	},

	is_branch_name: function(name) {
		return this.count_branches_named(name) > 0;
	},

	generate_unique_branch_name: function() {
		var new_name = this.new_branch.name;
		var i = 1;
	
		var is_duplicate = this.is_branch_name(new_name);
		while (is_duplicate) {
			new_name = this.new_branch.name + ' ' + i;
			is_duplicate = this.is_branch_name(new_name);
			i++;
		}

		return new_name;
	}
};

angular.module('main').controller('MjsController', ['$scope', '$q', 'mjs', 'notification', 'item', 'itemTypeMap', 'plumbConnectionManager', 'header', 'langManager', 'auth', 'user', MjsController]);
