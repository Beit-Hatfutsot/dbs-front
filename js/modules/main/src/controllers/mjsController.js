var MjsController = function(mjs, notification, item, auth, $rootScope, $scope) {
	var self = this;
	this.notification = notification;
	this.mjs = mjs;
	this.item = item;
	this.selected_branch = 0;
	this.mjs_items = [];
	this.$scope = $scope;
	this.branch_edit_status = {
            1: false,
            2: false,
            3: false,
            4: false,
    };
    this.in_rename_mode = false;
	this.rmdialog_status = false;
	this.in_edit_mode = false;

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});
	$rootScope.$on('loggedin', function(event, user) {
		var items_ids = [];
		user.story_items.forEach(function (i) {
			items_ids.push(i.id)
		})
		self.load(items_ids);
	});

	var items_ids = mjs.get_items_ids();
	if (items_ids)
		self.load(items_ids);
};

MjsController.prototype = {
	init: function() {
		var self = this;
		self.load(this.mjs.get_items_ids());
	},

	load: function(items_ids) {
		var self = this;

		this.mjs_items = [];
		this.notification.loading(true);

		this.item.get_items(items_ids).then(function (ret) {
				self.mjs_items = ret;
		}).finally(function() { self.notification.loading(false); });
	},

	stopPropagation: function($event) {
		$event.stopPropagation();
	},

	rename_branch: function(branch_num, new_name) {
		this.mjs.rename_branch(branch_num, new_name);
	},

	rename_user: function(new_name) {
		this.mjs.rename_user(new_name);
	}, 

	toggle_branch_edit: function(branch_num)  {
		if (this.branch_edit_status[branch_num]) {
			this.branch_edit_status[branch_num] = false;
			this.in_edit_mode = false;
		}
		else {
			for(var branch in this.branch_edit_status) {
				if (this.branch_edit_status[branch] && branch != branch_num) {
					this.branch_edit_status[branch] = false;
					break;
				}
			}
			this.branch_edit_status[branch_num] = true; 
			this.in_edit_mode = true;
		}
	},

	navigate_to_branch: function(branch_num) {
		this.selected_branch = branch_num;
	},

	toggle_branch_rmdialog: function()  {
		this.rmdialog_status = !(this.rmdialog_status);

	},
};

angular.module('main').controller('MjsController', ['mjs', 'notification',
								  'item', 'auth', '$rootScope', '$scope', MjsController]);
