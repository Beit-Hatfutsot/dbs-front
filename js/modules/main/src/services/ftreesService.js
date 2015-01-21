angular.module('main').
	factory('ftrees', ['$http', '$q', 'apiClient', function($http, $q, apiClient) {
		var in_progress = false,
			parser = new GedcomParser(),
			viewer = new GedcomViewer();

		var ftrees = {
			search: function(params) {
				if (!in_progress) { 
					in_progress = true;
					var deferred = $q.defer();

					$http.get(apiClient.urls.ftrees_search, {params: params}).
						success(function(individuals) {
							deferred.resolve(individuals);
						}).
						error(function() {
							deferred.reject();
						}).
						finally(function() {
							in_progress = false;
						});

					return deferred.promise;
				}
			},

			get_data: function(tree_number) {
				if (!in_progress) {
					in_progress = true;
					var self = this,
						deferred = $q.defer();

					this.get_meta(tree_number).
						then(function(tree_meta) {
							self.load(tree_meta.tree_file).
								then(function(tree_data) {
									deferred.resolve(tree_data);
								}, function() {
									deferred.reject();
								}).
								finally(function() {
									in_progress = false;
								});
						}, function() {
							deferred.reject();
							in_progress = false;
						});
					
					return deferred.promise;
				}
			},

			get_meta: function(tree_number) {	
				var deferred = $q.defer();

				$http.get(apiClient.urls.ftrees_get + '/' + tree_number).
					success(function(tree_data) {
						deferred.resolve(tree_data);
					}).
					error(function() {
						deferred.reject();
					});

				return deferred.promise;
			},

			load: function(gedcom_url) {
				var deferred = $q.defer();

				$http.get(gedcom_url).
					success(function(gedcom_text) {
						deferred.resolve(parser.parse(gedcom_text));
					}).
					error(function() {
						deferred.reject();
					});

				return deferred.promise;
			},

			get_individuals_subset: function(individual_id) {
				var family, parents,
					individual_data = this.get_individual_data(individual_id);

				if (individual_data.parent_data) {
					parents = {
						husband: {},
						wife: {},
						children: []
					};
					parents.husband.id = individual_data.parent_data.husb.id;
					parents.husband.name = individual_data.parent_data.husb.getValue('name');
					parents.husband.sex = individual_data.parent_data.husb.getValue('sexe');
					parents.wife.id = individual_data.parent_data.wife.id;
					parents.wife.name = individual_data.parent_data.wife.getValue('name');
					parents.wife.sex = individual_data.parent_data.wife.getValue('sexe');

					individual_data.parent_data.childs.forEach(function(child) {
						var child_obj = {
							id: child.id,
							name: child.getValue('name'),
							sex: child.getValue('sexe')
						};
						parents.children.push(child_obj);
					});
				}
				else {
					parents = {};
				}

				if (individual_data.family_data) {
					family = {
						spouse: {},
						children: []
					};
					var spouse;
					if (individual_data.family_data.husb.id === individual_id) {
						spouse = individual_data.family_data.wife; 
					}
					else if (individual_data.family_data.wife.id === individual_id) {
						spouse = individual_data.family_data.husb;
					}
					family.spouse.id = spouse.id;
					family.spouse.name = spouse.getValue('name');
					family.spouse.sex = spouse.getValue('sexe');
					individual_data.family_data.childs.forEach(function(child) {
						var child_obj = {
							id: child.id,
							name: child.getValue('name'),
							sex: child.getValue('sexe')
						};
						family.children.push(child_obj);
					});
				}
				else {
					family = {};
				}

				return {
					parents: parents,
					family: family
				};
			},

			get_individual_data: function(individual_id) {
				var raw_data = parser.getData(individual_id);

				if (raw_data) {
					var parent_data = raw_data.getValue('familleParent'),
						family_data = raw_data.getValue('familles')[0];
				}
				
				return {
					parent_data: parent_data,
					family_data: family_data
				};
			} 
		}

		return ftrees;
	}]);