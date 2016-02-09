var MjsController = function($q, mjs, notification, item, itemTypeMap, header, langManager, auth, user) {
	var self = this;

	this.$q = $q;
	this.notification = notification;
	this.mjs = mjs;
	this.itemTypeMap = itemTypeMap;
	this.item = item;
	this.langManager = langManager;
	this.header = header;
	this.user = user;
	this.selected_branch = 0;
	this.mjs_data = [];
	this.items_counter = [0,0,0,0];
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

	this.init();
};

MjsController.prototype = {
	init: function() {


		this.notification.put({
			en: 'Loding Story...',
			he: 'טוען את הסיפור...'
		});
		this.refresh();
	},

	refresh: function() {
		var self = this;
		var items_ids = [];

		this.mjs.refresh().then(function () {
			var items_ids = [];
			//console.log(self.mjs.data);
			self.mjs.data.items.forEach(function (i) {
				items_ids.push(i.id);
			})
			self.item.get_items(items_ids).then (function (ret) {
				self.mjs_data = [];
				self.mjs.data.items.forEach(function(i, _i) {
					ret[_i].branches = i.branches;
					ret[_i].item_string = i.id;
					self.mjs_data.push(ret[_i]);
					i.branches.forEach(function (flag, _j) {
						if (flag)
							self.items_counter[_j]++;
					});
				})
			});
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
		console.log(this.rmdialog_status);

	}
};

angular.module('main').controller('MjsController', ['$q', 'mjs', 'notification', 'item', 'itemTypeMap', 'header', 'langManager', 'auth', 'user', MjsController]);
