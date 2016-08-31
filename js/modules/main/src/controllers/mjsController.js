var MjsController = function(mjs, notification, item, auth, $rootScope, $scope,
                             $state, $stateParams, $http, apiClient, langManager) {
	var self = this;
	this.notification = notification;
	this.mjs = mjs;
	this.auth = auth;
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
    this.langManager = langManager;
	this.$rootScope = $rootScope;

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

  if ($stateParams.user_id) {
    // another user's story - story.html
	self.public_url = $state.href('story',{user_id: $stateParams.user_id},
								  {absolute: true});
    $http.get(apiClient.urls.story+'/'+$stateParams.user_id)
         .then(function(res) {
           var items_ids = []
           self.user = res.data;
		   self.refresh_root_scope();
           res.data.story_items.forEach(function(i) {
             items_ids.push(i.id)
           });
           self.load(items_ids);
         });
  }
  else {
    // logged in user story - mjs.html
    if(!auth.user) {
      $rootScope.$on('loggedin', function(event, user) {
        var items_ids = [];
        self.user = user;
	    self.refresh_root_scope();
        user.story_items.forEach(function (i) {
          items_ids.push(i.id)
        })
        self.load(items_ids);
        self.public_url = $state.href('story',{user_id: user.hash},{absolute: true});
      });
    } else {
      var items_ids = mjs.get_items_ids();
      self.user = auth.user;
      self.public_url = $state.href('story',{user_id: self.user.hash},{absolute: true});
	  self.refresh_root_scope();
      if (items_ids.length > 0) {
        self.load(items_ids);
      }
    }
  };


	$rootScope.$on('item-removed', function(events, item_slug) {
		var mjs_items = [];
		for (var i in self.mjs_items) {
			if(self.mjs_items[i].Slug.En != item_slug) {
				mjs_items.push(self.mjs_items[i]);
			}
		}
		self.mjs_items = mjs_items;
	});
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

		this.item.get_items(items_ids).then(function (items) {
        var counters = [0,0,0,0]
        items.forEach(function (item_data) {
          var item_string = self.item.get_key(item_data);
          self.user.story_items.every(function(item) {
              if (item_string == item.id) {
                  item_data.in_branch = item.in_branch.slice();
                  return false;
              }
              return true;
          });
          item_data.in_branch.forEach(function(in_branch, i) {
            if (in_branch)
              counters[i] += 1;
          });
        });
				self.mjs_items = items;
        self.items_counters = counters;

		}).finally(function() { self.notification.loading(false); });
	},

	stopPropagation: function($event) {
		$event.stopPropagation();
	},

	rename_branch: function(branch_num, new_name) {
		this.mjs.rename_branch(branch_num, new_name);
	},

	rename_user: function(new_name) {
        var current_lang = this.langManager.lang;
		this.mjs.rename_user(new_name, current_lang);
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
	refresh_root_scope: function() {
		var $rootScope = this.$rootScope;
			language_map = {'en': 'En', 'he': 'He'},
			lang = language_map[$rootScope.lang],
			branches = this.user.story_branches
								.filter(function(a) {return a!=''})
								.join(', ');

		if (lang == 'En') {
			if (this.user.name && this.user.name.en) {
				$rootScope.title = this.user.name.en + " Family Story";
				$rootScope.description = this.user.name.en + " has collected photos, stories ";
			}
			else {
				$rootScope.title = "My Family Story";
				$rootScope.description = "A collection of photos, stories ";
			}
			if (branches)
				$rootScope.description += "divided into the "+branches+" branches.";
			else
				$rootScope.description += "and more.";
		}
		else {
			if (this.user.name && this.user.name.he) {
				$rootScope.title = "סיפור המשפחה של " + this.user.name.he;
				$rootScope.description = "אסף תמונות ומאמרים אודות המשפחתה של " + this.user.name.he + ".";
			}
			else {
				$rootScope.title = "סיפור משפחתי";
				$rootScope.description = "אוסף תמונות ומאמרים אודות המשפחה.";
			}
			if (branches)
				$rootScope.description += " האוסף כולל את הענפים: "+branches;
		}
	}
};

angular.module('main').controller('MjsController', ['mjs', 'notification',
								  'item', 'auth', '$rootScope', '$scope', '$state',
                  '$stateParams', '$http', 'apiClient', 'langManager',
                  MjsController]);
