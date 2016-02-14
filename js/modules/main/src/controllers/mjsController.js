var MjsController = function(mjs, notification, item, auth) {
	var self = this;

	this.notification = notification;
	this.mjs = mjs;
	this.item = item;
	this.selected_branch = 0;
	this.mjs_items = [];
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
		// TODO: `load` is probably a better name for this function and the one
		// in the service too
		this.mjs_items = [];

		var self = this;
		var items_ids = [];


		this.mjs.refresh().then(function () {
			var item_ids = self.mjs.items_ids();

			self.item.get_items(item_ids).then (function (ret) {
				self.items_counter = [0, 0, 0, 0];
				ret.forEach(function(i, _i) {
					// TODO: refactor `id` to `url` 
					var mjs = self.mjs.dict[i.id];
					if (mjs) {
						i.branches = mjs.branches;
						i.item_string = mjs.id;
						// update the counters
						i.branches.forEach(function (flag, _flag) {
							if (flag)
								self.items_counter[_flag]++;
						});
					};
					self.mjs_items.push(i);

				});
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

angular.module('main').controller('MjsController', ['mjs', 'notification',
								  'item', 'auth', MjsController]);
