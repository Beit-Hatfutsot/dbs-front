angular.module('main').
	factory('mjs', ['$resource', 'apiClient', function($resource, apiClient) {
		var mjsResource = $resource(apiClient.urls.mjs, null, {
			post: {method: 'POST'}
		});

		var mjs = {
			data: mjsResource.get(),

			refresh: function() {
				return this.data.$get();
			},

			add: function(item_string) {
				return mjsResource.post(item_string).$promise;
			},

			remove: function(item_string) {
				var self = this;

				if (this.data.$resolved) {		
					var index = this.data.unassigned.indexOf(item_string);
		 			if (index !== -1) {
		 				this.data.unassigned.splice(index, 1);
		 			}
		 			else {
		 				this.data.assigned.forEach(function(branch) {
		 					var index = branch.items.indexOf(item_string);
		 					if (index !== -1) {
		 						branch.items.splice(index, 1);
		 					}
		 				});
		 			}

		 			return this.data.$put();
				}
			},

			assign: function(branch_name, item_string) {
				var self = this;

				if (this.data.$resolved) {
					var index = this.data.unassigned.indexOf(item_string);
					this.data.unassigned.splice(index, 1);

					var branch = this.data.assigned.filter(function(branch) {
						return branch.name == branch_name;
					})[0];
					
					branch.items.push(item_string);
					return this.data.$put().
						then(null, function() {
							self.data.unassigned.splice(index, 0, item_string);
							branch.items.splice(branch.items.indexOf(item_string), 1); 
						});
				}
			},

			unassign: function(branch_name, item_string) {
				if (this.data.$resolved) {
					var branch = this.data.assigned.filter(function(branch) {
						return branch.name == branch_name;
					})[0];
					var index = branch.items.indexOf(item_string);
					branch.items.splice(index, 1);

					this.data.unassigned.push(item_string);

					return this.data.$put();
				}
			},

			in_mjs: function(item_string) {
				var in_mjs = false;

				if ( this.data.hasOwnProperty('unassigned') || this.data.hasOwnProperty('assigned') ) {
					var in_unassigned = this.data['unassigned'].indexOf(item_string);
					if (in_unassigned !== -1) {
						return true;
					}
					else {
						this.data['assigned'].forEach(function(branch) {
							var in_assigned = branch.items.indexOf(item_string);
							if (in_assigned !== -1) {
								in_mjs = true;
							}
						});
					}

					return in_mjs;
				}
				
				return false;
			},

			add_branch: function(branch_name) {
				if (this.data['assigned'].length < 4) {
					this.data['assigned'].push({
						name: branch_name,
						items: []
					});
					return this.data.$put();
				}
			},

			remove_branch: function(branch_name) {
				var branch = this.data['assigned'].filter(function(branch) {
					return branch.name === branch_name;
				})[0];
				var index = this.data['assigned'].indexOf(branch);
				this.data['assigned'].splice(index, 1)

				return this.data.$put();
			}
		};
		/*
		mjs.data.$promise.
			then(function(mjs_data) {

				if ( !(mjs_data.hasOwnProperty('unassigned')) || !(mjs_data.hasOwnProperty('assigned')) ) {
					if ( !(mjs_data.hasOwnProperty('unassigned')) ) {
						mjs_data.unassigned = [];
					}
					if ( !(mjs_data.hasOwnProperty('assigned')) ) {
						mjs_data.assigned = [{
							name: 'default',
							items: []
						}];
					}
					
					mjs_data.$put();
				}
			});
*/
		return mjs;
	}]);