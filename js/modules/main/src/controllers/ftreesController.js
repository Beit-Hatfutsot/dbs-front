var FtreesController = function($scope, $state, $stateParams, $location, ftrees) {
	var self = this;

	this.individuals = [];
	this.tree_view = false;
	this.selected_individual = null;
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
	this.$location = $location;
	this.ftrees = ftrees;

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
				if (self.$stateParams.ind_index) {
					self.select_individual( self.individuals[self.$stateParams.ind_index] );
				}
			});
	},

	select_individual: function(individual) {
		if (this.selected_individual && this.selected_individual._id && this.selected_individual._id === individual._id) {
			this.tree_view = false;
			this.selected_individual = null;	
		}
		else {
			this.ftrees.get(individual.GT).
				then(function(tree_data) {
					console.log(tree_data);

					//GedcomIHM.init();
					var parser = new GedcomParser();
					//var viewer = new GedcomViewer();
					//GedcomPlugins.checkRequired();
					//GedcomPlugins.sort();

					parser.load(tree_data.tree_file);
				});
			this.tree_view = true;
			this.selected_individual = individual;
			this.$location.search('ind_index', this.individuals.indexOf(individual));
		}
	},

	is_selected: function(individual) {
		if (this.selected_individual && this.selected_individual._id && this.selected_individual._id === individual._id) {
			return true;	
		}

		return false;
	}
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', FtreesController]);
