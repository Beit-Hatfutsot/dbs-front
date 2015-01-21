var FtreesController = function($scope, $state, $stateParams, $location, ftrees, notification) {
	var self = this;

	this.individuals = [];
	this.selected_individual = null;
	this.selected_individual_data = {};
	this.search_params = {};
	this.search_modifiers = {
		first_name: 0,
		last_name: 0,
		maiden_name: 0,
		birth_place: 0,
		marriage_place: 0,
		death_place: 0
	};
	this.fudge_factors = {
		birth_year: 0,
		marriage_year: 0,
		death_year: 0
	};
	this.modifier_map = {
		0: '',
		1: 'prefix',
		2: 'phonetic'
	}
	
	this.inverse_modifier_map = {}
	for (var code in this.modifier_map) {
		var modifier_string = this.modifier_map[code]
		this.inverse_modifier_map[modifier_string] = code;
	}

	this.results_per_page = 15;
	this.display_from_result = 0;

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;

	Object.defineProperty(this, 'tree_view', {
		get: function() {
			return $state.includes('ftree-view');
		}
	})

	Object.defineProperty($scope, 'tree_view', {
		get: function() {
			return self.tree_view;
		}
	})

	for (var param in $stateParams) {
		if ( $stateParams[param] !== undefined ) {
			this.search_params[param] = $stateParams[param];

			// handle search modifiers & fudge factors in query string
			if ( $stateParams[param].indexOf('~') !== -1 ) {
				var parts = this.search_params[param].split('~');
				this.search_params[param] = parts[0];
				this.fudge_factors[param] = parts[1];
			}
			else if ( $stateParams[param].indexOf(';') !== -1 ) {
				var parts = this.search_params[param].split(';');
				this.search_params[param] = parts[0];	
				this.search_modifiers[param] = this.encode_modifier(parts[1]);
			}
		}
	};
	
	$scope.$watch('tree_view', function(newVal, oldVal) {
		if (!newVal) {
			self.selected_individual = null;
		}
	});

	//search
	this.search();
};

FtreesController.prototype = {
	encode_modifier: function(modifier_string) {
		return this.inverse_modifier_map[modifier_string];
	},

	decode_modifier: function(modifier_code) {
		return this.modifier_map[modifier_code];
	},

	search: function() {
		var self = this, 
			search_params = angular.copy(this.search_params);

		this.notification.put({
			en:'Searching family trees...',
			he: 'מחפש בעצי משפחה...'			
		});

		if (search_params.ind_index) {
			delete(search_params.ind_index);
		}

		// insert search modifiers & fudge_factors into query string
		for (var modifier in this.search_modifiers) {
			var modifier_code = this.search_modifiers[modifier];	
			if (search_params[modifier] !== undefined && modifier_code !== 0) {
				var modifier_string = self.decode_modifier(modifier_code);
				search_params[modifier] += ';' + modifier_string;
			}
		}
		for (var factor in this.fudge_factors) {
			var fudge_val = this.fudge_factors[factor];	
			if (search_params[factor] !== undefined && fudge_val !== 0) {
				search_params[factor] += '~' + fudge_val;
			}
		}

		this.ftrees.search(search_params).
			then(function(individuals) {
				self.individuals = individuals;
				for (var param in self.search_params) {
					self.$location.search(param, search_params[param]);	
				}

				self.notification.put({
					en: 'Family Trees Search has finished successfully.',
					he: 'חיפוש בעצי משפחה הסתיים בהצלחה.'
				});

				if (self.tree_view) {
					self.$scope.$broadcast('search-end');
				}
			}, function() {
				self.notification.put({
					en: 'Family Trees Search has failed.',
					he: 'חיפוש בעצי משפחה נכשל.'
				});
			});
	},

	select_individual: function(individual) {
		var self = this;
		
		if (this.selected_individual && this.selected_individual._id && this.selected_individual._id === individual._id) {
			//this.tree_view = false;
			//this.selected_individual = null;	
		}
		else {
			this.notification.put({
				en: 'Loading tree...',
				he: 'טוען עץ...'
			});
			this.ftrees.get_data(individual.GT).
				then(function(tree_data) {
					console.log(tree_data)
					var subset = self.ftrees.get_individuals_subset('@' + individual.II + '@');

					self.selected_individual = {
						_id: individual._id,
						id: individual.II,
						name: individual.FN + ' ' + individual.LN,
						sex: individual.G,
						parents: subset.parents,
						family: subset.family
					};

					self.notification.put({
						en: 'Family tree successfully loaded.',
						he: 'עץ משפחה נטען בהצלחה.'
					});

					self.$state.go('ftree-view', {ind_index: self.individuals.indexOf(individual)});	
				}, function() {
					self.notification.put({
						en: 'Failed to load tree.',
						he: 'טעינת עץ נכשלה.'
					});
				});
		}
	},

	is_selected: function(individual) {
		if (this.selected_individual && this.selected_individual._id && this.selected_individual._id === individual._id) {
			return true;	
		}

		return false;
	}
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', 'notification', FtreesController]);
