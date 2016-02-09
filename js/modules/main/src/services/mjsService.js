angular.module('main').
	factory('mjs', ['$http', '$resource', 'apiClient', function($http, $resource, apiClient) {
		var mjsResource = $resource(apiClient.urls.mjs, null, {
			post: {method: 'POST'},
		});

		var mjs = {
			data: mjsResource.get(),

			update_branch_name: function(branch_num, new_name) {
				$http.post(apiClient.urls.mjs +'/'+ branch_num + '/name', new_name);
			},

			refresh: function() {
				return this.data.$get();
			},

			add: function(item_string) {
				return mjsResource.post(item_string).$promise;
			},

			remove_from_story: function(item_string) {
				return $http.delete(apiClient.urls.mjs +'/'+ item_string);
			},

			add_to_branch: function(item_string, branch_num) {
				$http.post(apiClient.urls.mjs +'/'+ (parseInt(branch_num) + 1), item_string);
			},

			remove_from_branch: function(item_string, branch_num) {
				$http.delete(apiClient.urls.mjs + '/' + (parseInt(branch_num) + 1) + '/' + item_string);
			},

			in_mjs: function(item_string) {
				var in_mjs = false;

				if (this.data.hasOwnProperty('items')) {
					this.data['items'].every(function(item) {
						if (item_string == item.id) {
							in_mjs = true;
							return false;
						}
						return true;
					});
				}
			
				return in_mjs;
			},

		};

		return mjs;
	}]);