angular.module('main').
	factory('mjs', ['$resource', 'apiClient', function($resource, apiClient) {
		var mjsResource = $resource(apiClient.urls.mjs, null, {
			put: {method: 'PUT'}
		}),

		mjs = {
			
			data: mjsResource.get(),

			add: function(item_string) {
				if (this.data.$resolved && !this.in_mjs(item_string)) {
					if ( this.data.hasOwnProperty('unassigned') ) {
						this.data.unassigned.push(item_string);
					}
					else {
						this.data.unassigned = [item_string];
					}
					if ( !(this.data.hasOwnProperty('assigned')) ) {
						this.data.assigned = [{
							name: 'default',
							items: []
						}];
					}
					
					return this.data.$put();
				}
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
				if (this.data.$resolved) {
					var index = this.data.unassigned.indexOf(item_string);
					this.data.unassigned.splice(index, 1);

					var branch = this.data.assigned.filter(function(branch) {
						return branch.name == branch_name;
					})[0];
					
					branch.items.push(item_string);
					return this.data.$put();
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
				console.log(branch_name)
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

		return mjs;
	}]);