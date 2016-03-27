angular.module('main').
	factory('ftrees', ['$http', '$q', 'apiClient', function($http, $q, apiClient) {
		var in_progress = false;
		var contributor_images = {
			'babylonjewry.org.il': 'images\/babylon.jpg'
		};

		var ftrees = {

			get_contributor_path: function(individual) {
				if (individual) {
					// check for editor remarks
					var editor_remarks = individual.editor_remarks || individual.EditorRemarks;
                    // Check for the contributor path metadata in the format of
                    // <source:contributor_id>
                    var contibutor_source_regex = new RegExp("<source:.+>");
                    var contributor_md_match = contibutor_source_regex.exec(editor_remarks);
                    if (contributor_md_match) {
                        var contributor_id = contributor_md_match[0].split(':')[1].split('>')[0];
				        if (contributor_id in contributor_images) {
					        return contributor_images[contributor_id];	
				        }
				    }
                }
			},

			search: function(params) {
				//if (!in_progress) { 
					var self = this;

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
				//}
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

			parse_individual: function(individual) {
				var	individual_id = individual.II[0] === '@' ? individual.II : '@' + individual.II + '@',
					subset = this.get_individuals_subset(individual_id); 

				var parsed_individual = {
					_id: individual._id,
					id: individual_id,
					name: individual.FN + " " + individual.LN,
					tree_number: individual.GTN,
					last_name: individual.LN,
					first_name: individual.FN,
					sex: individual.G,
					editor_remarks: individual.EditorRemarks,
					parent_family: subset.parent_family,
					family: subset.family,
					birth_year: individual.BD ? individual.BD.substr(-4) : null,
					birth_date: individual.BD,
					birth_place: individual.BP,
					death_year: individual.DD ? individual.DD.substr(-4) : null,
					death_date: individual.DD,
					death_place: individual.DP,
					marriage_date: individual.MD,
					marriage_place: individual.MP
				};

				parsed_individual.alive = is_alive_parsed(parsed_individual);

				return parsed_individual;
			},

			get_individuals_subset: function(individual_id) {
				var family, parent_family,
					individual_data = this.get_individual_data(individual_id);

				if (individual_data.parent_data) {
					parent_family = this.parse_parent(individual_data.parent_data);
				}
				else {
					parent_family = {};
				}

				if (individual_data.family_data) {
					family = this.parse_family(individual_data.family_data, individual_id);
				}
				else {
					family = {};
				}

				return {
					parent_family: parent_family,
					family: family
				};
			},

			parse_parent: function(parent_data) {
				var parsed_parent = {
					husband: {},
					wife: {},
					children: [],
				};
				
				if (parent_data.husb) {
					parsed_parent.husband.id = parent_data.husb.id;
					parsed_parent.husband.name = parse_name( parent_data.husb.getValue('name') );
					parsed_parent.husband.sex = parent_data.husb.getValue('sexe');
					var birth = parent_data.husb.getValue('birt');
					if (birth) {
						if (birth.date) {
							parsed_parent.husband.birth_year = birth.date.substr(-4);
							parsed_parent.husband.birth_date = birth.date;
						}
						if (birth.place) {
							parsed_parent.husband.birth_place = birth.place
						}
					}
					var death = parent_data.husb.getValue('deat');
					if (death) {
						if (death.date) {
							parsed_parent.husband.death_year = death.date.substr(-4);
							parsed_parent.husband.death_date = death.date;	
						}
						if (death.place) {
							parsed_parent.husband.death_place = death.place;
						}
					}
					parsed_parent.husband.alive = is_alive_parsed(parsed_parent.husband);
					var marr = parent_data.marr;
					if (marr) {
						parsed_parent.husband.marriage_place = parent_data.marr.place;
						parsed_parent.husband.marriage_date = parent_data.marr.date;
					}
				}
				if(parent_data.wife) {
					parsed_parent.wife.id = parent_data.wife.id;
					parsed_parent.wife.name = parse_name( parent_data.wife.getValue('name') );
					parsed_parent.wife.sex = parent_data.wife.getValue('sexe');
					var birth = parent_data.wife.getValue('birt');
					if (birth) {
						if (birth.date) {
							parsed_parent.wife.birth_year = birth.date.substr(-4);
							parsed_parent.wife.birth_date = birth.date;
						}
						if (birth.place) {
							parsed_parent.wife.birth_place = birth.place;
						}
					}
					var death = parent_data.wife.getValue('deat');
					if (death) {
						if (death.date) {
							parsed_parent.wife.death_year = death.date.substr(-4);
							parsed_parent.wife.death_date = death.date;	
						}
						if (death.place) {
							parsed_parent.wife.death_place = death.place;
						}
					}
					parsed_parent.wife.alive = is_alive_parsed(parsed_parent.wife);
				}

				parent_data.childs.forEach(function(child) {
					var child_obj = {
						id: child.id,
						name: parse_name( child.getValue('name') ),
						sex: child.getValue('sexe'),
						// spouse : child.getValue(''),
					};

					var birth = child.getValue('birt');
					if (birth) {
						if (birth.date) {
							child_obj.birth_year = birth.date.substr(-4);
							child_obj.birth_date = birth.date;
						}
						if (birth.place) {
							child_obj.birth_place = birth.place;
						}
					}
					var death = child.getValue('deat');
					if (death) {
						if (death.date) {
							child_obj.death_year = death.date.substr(-4);
							child_obj.death_date = death.date;
						}
						if (death.place) {
							child_obj.death_place = death.place;
						}
					}
					child_obj.alive = is_alive_parsed(child_obj)

					parsed_parent.children.push(child_obj);
				});
				
				return parsed_parent;
			},

			parse_family: function(family_data, individual_id) {
				var self = this;
				var parsed_family = {
					spouse: {},
					children: []
				};
				var spouse;
				if (family_data.husb && family_data.husb.id === individual_id) {
					spouse = family_data.wife; 
				}
				else if (family_data.wife && family_data.wife.id === individual_id) {
					spouse = family_data.husb;
				}

				if (spouse) {
					parsed_family.spouse.id = spouse.id;
					parsed_family.spouse.name = parse_name( spouse.getValue('name') );
					parsed_family.spouse.sex = spouse.getValue('sexe');
					var birth = spouse.getValue('birt');
					if (birth) {
						if (birth.date) {
							parsed_family.spouse.birth_year = birth.date.substr(-4);
							parsed_family.spouse.birth_date = birth.date;
						}
						if (birth.place) {
							parsed_family.spouse.birth_place = birth.place;
						}
					}
					var death = spouse.getValue('deat');
					if (death) {
						if (death.date) {
							parsed_family.spouse.death_year = death.date.substr(-4);
							parsed_family.spouse.death_date = death.date;
						}
						if (death.place) {
							parsed_family.spouse.death_place = death.place;
						}
					}
					parsed_family.spouse.alive = is_alive_parsed(parsed_family.spouse);
				}
				
				family_data.childs.forEach(function(child) {
					var child_obj = {
						id: child.id,
						name: parse_name( child.getValue('name') ),
						sex: child.getValue('sexe')
					};
					var birth = child.getValue('birt');
					if (birth) {
						if (birth.date) {
							child_obj.birth_year = birth.date.substr(-4);
							child_obj.birth_date = birth.date;
						}
						if (birth.place) {
							child_obj.birth_place = birth.place;
						}
					}
					var death = child.getValue('deat');
					if (death) {
						if (death.date) {
							child_obj.death_year = death.date.substr(-4);
							child_obj.death_place = death.place;
						}
						if (death.place) {
							child_obj.death_place = death.place;
						}
					}
					child_obj.alive = is_alive_parsed(child_obj);

					var child_family_data = self.get_individual_data(child.id).family_data;
					if (child_family_data) {
						child_obj.family = self.parse_family(child_family_data, child_obj.id);
					}
					else {
						child_obj.family = {};
					}
					parsed_family.children.push(child_obj);
				});

				return parsed_family;
			},
		}

		function parse_name(name) {
			name = name[0];
			if (!name || name.indexOf('/') === -1) {
				return name;
			}

			var n = name.split('/');
			var parsed_name = n[0] + ' ' + n[1];
			return parsed_name;
		}

		function is_alive(individual) {
			var alive = true;
			var date = new Date();
			var year = date.getFullYear();
			var age = get_age(individual.BD, year);

			if (individual.DD || individual.DP || age > 100 ) {
				alive = false;
			}

			return alive
		}

		function is_alive_parsed(individual) {
			var alive = true;
			var date = new Date();
			var current_year = date.getFullYear();
			var birth_year = individual.birth_year;
			var age = birth_year ? current_year - birth_year : 0;


			if (individual.death_year || individual.death_place || age > 100 ) {
				alive = false;
			}

			return alive	
		}

		function get_age(bd, current_year) {
			try {
				var birth_year = parseInt( bd.substr(-4) );
				var age = current_year - birth_year;

				return age;
			}
			catch(e) {
				return 0;
			}
		}

		return ftrees;
	}]);
