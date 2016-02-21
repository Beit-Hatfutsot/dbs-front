var MjsController = function(mjs, notification, item, auth, user, $rootScope) {
	var self = this;

	this.notification = notification;
	this.mjs = mjs;
	this.item = item;
	this.selected_branch = 0;
	this.mjs_items = [];
	this.user = user;
	this.branch_edit_status = {
		1: false,
		2: false,
		3: false,
		4: false,
	};
	this.rmdialog_status = false;

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

	$rootScope.$on('mjs_updated', function(items_n_branches) {
		debugger;
		var items_ids = [];
		items_n_branches.story_items.forEach(function (i) {
			items_ids.push(i.id)
		})
		self.load(items_ids);
	});

	this.init();
};

MjsController.prototype = {
	init: function() {
		var self = this;

		this.notification.put({
			en: 'Loding Story...',
			he: 'טוען את הסיפור...'
		});
		this.mjs.get_items_ids().then(function (items_ids) {
			self.load(items_ids);
		});
	},

	load: function(items_ids) {
		var self = this;

		this.mjs_items = [];

		this.item.get_items(items_ids).then(function (ret) {
				self.mjs_items = ret;
		});
	},

	stopPropagation: function($event) {
		$event.stopPropagation();
	},

	update_branch_name: function(branch_num, new_name) {
		this.mjs.update_branch_name(branch_num, new_name);
	},

	toggle_branch_edit: function($event,index)  {
		this.branch_edit_status[index] = !(this.branch_edit_status[index]); 
	},

	toggle_branch_rmdialog: function()  {
		this.rmdialog_status = !(this.rmdialog_status);
		//console.log(this.rmdialog_status);

	}
};

angular.module('main').controller('MjsController', ['mjs', 'notification',
								  'item', 'auth', 'user', '$rootScope', MjsController]);
