angular.module('main').
	factory('mjs', ['$http', '$resource', 'apiClient', '$rootScope', 'item',
					'user', '$q', '$sessionStorage', '$window',
					function($http, $resource, apiClient, $rootScope, item,
							 user, $q, $sessionStorage, $window) {
		var self = this;
		self.item = item;


		var mjs = {
			// items_counters: [0,0,0,0];
			get: function () {
				var self = this,
					latest = self._latest;

				if (latest)
					return $q.resolve(latest);
				else {
					return user.$promise.then(function(user) {
						self._latest = user; 
						// update_latest(user);
						return self._latest;
					})
				}
			},

			dict: {},

			_update_latest: function (response) {
				mjs._latest = response.data;
			},

			rename_branch: function(branch_num, new_name) {
				$http.post(apiClient.urls.mjs +'/'+ branch_num + '/name', new_name)
					 .then(mjs._update_latest);
			},

			add: function(item_string) {
				return $http.post(apiClient.urls.mjs, item_string)
								  .then(mjs._update_latest);
			},

			remove: function(item_string) {
				return $http.delete(apiClient.urls.mjs +'/'+ item_string)
							.then(mjs._update_latest);
			},

			add_to_branch: function(item_string, branch_num) {
				// this.items_counter[branch_num]++;
				var self = this;
				$http.post(apiClient.urls.mjs +'/'+ (parseInt(branch_num) + 1),
						   item_string)
					 .then(mjs._update_latest);
			},

			remove_from_branch: function(item_string, branch_num) {
				// this.items_counter[branch_num]--;
				$http.delete(apiClient.urls.mjs + '/' + (parseInt(branch_num) + 1) + '/' + item_string)
					 .then(function(data) {
					 mjs._update_latest(data);
					 });
			},

			get_items_ids: function () {
				return this.get().then(function (data) {
					var ret = [];
					data.story_items.forEach(function (i) {
						ret.push(i.id);
					});
					return ret;
				})
			}
		};
		//get latest from session storage
		Object.defineProperty(mjs, '_latest', {
			enumerable: true,
			get: function () {
				return $sessionStorage.latest_mjs;
			},
			set: function(story) {
				$sessionStorage.latest_mjs = story;
				$rootScope.$broadcast('mjs-updated', story);
			}
		});
		Object.defineProperty(mjs, 'items_counters', {
			get: function () {
				var story = mjs._latest;
					ret = [0,0,0,0];

				story.story_items.forEach(function(i, _i) {
					i.in_branch.forEach(function (flag, _flag) {
						if (flag)
							ret[_flag]++;
					});
				});
				return ret;
			}
		});
		/*
		** When a new Item is loaded, check if it's in the story and update `in_mjs` on the `item_data`
		*/
		$rootScope.$on('item-loaded', function (event, items) {
			if (items.constructor !== Array)
				items = [items]
			mjs.get().then(function (items_n_branches) {
				items.forEach(function (item_data) {
					var item_string = self.item.get_data_string(item_data);

					var in_mjs = false;

					items_n_branches.story_items.every(function(item) {
						if (item_string == item.id) {
							in_mjs = true;
							item_data.in_branch = item.in_branch.slice();
							mjs.dict[item_string] = item;
						}
						return !in_mjs;
					});
					item_data.in_mjs = in_mjs;
				});
			});
		});

		return mjs;
	}]);
