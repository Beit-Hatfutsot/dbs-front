angular.module('main').
	factory('mjs', ['$http', '$resource', 'apiClient', '$rootScope', 'item',
		function($http, $resource, apiClient, $rootScope, item) {
		var self = this;
		self.item = item;

		var mjsResource = $resource(apiClient.urls.mjs);

		var mjs = {
			data: mjsResource.get(),

			dict: {},

			items_counter : [0,0,0,0],

			update_branch_name: function(branch_num, new_name) {
				$http.post(apiClient.urls.mjs +'/'+ branch_num + '/name', new_name);
			},

			refresh: function() {
				return this.data.$get().then(function() {
					
				});
			},

			add: function(item_string) {
				return mjsResource.save(item_string).$promise;
			},

			remove_from_story: function(item_string) {
				return $http.delete(apiClient.urls.mjs +'/'+ item_string);
			},

			add_to_branch: function(item_string, branch_num) {
				this.items_counter[branch_num]++;
				$http.post(apiClient.urls.mjs +'/'+ (parseInt(branch_num) + 1), item_string);
			},

			remove_from_branch: function(item_string, branch_num) {
				this.items_counter[branch_num]--;
				$http.delete(apiClient.urls.mjs + '/' + (parseInt(branch_num) + 1) + '/' + item_string);
			},

			items_ids: function () {
				var ret = [];
				this.data.items.forEach(function (i) {
					ret.push(i.id);
				});
				return ret;
			}
		};

		/*
		** When a new Item is loaded, check if it's in the story and update `in_mjs` on the `item_data`
		*/
		$rootScope.$on('item-loaded', function (event, data) {
			if (data.constructor !== Array)
				data = [data]
			data.forEach(function (item_data) {
				var item_string = self.item.get_data_string(item_data);

				mjs.data.$promise.then(function () {
					var in_mjs = false,
						mjs_item = null;

					mjs.data['items'].every(function(item) {
						if (item_string == item.id) {
							in_mjs = true;
							mjs_item = item;
						}
						return !in_mjs;
					});
					item_data.in_mjs = in_mjs;
					if (in_mjs)  {
						item_data.branches = mjs_item.branches;
						mjs.dict[item_string] = mjs_item;
					}
				});
			});
		});

		return mjs;
	}]);
