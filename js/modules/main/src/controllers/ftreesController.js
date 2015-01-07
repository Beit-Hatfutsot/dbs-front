var FtreesController = function($scope, $state, $stateParams, $location, ftrees) {
	var self = this;

	this.individuals = [];
	this.tree_view = false;
	this.selected_individual = null;
	this.search_params = {};
	this.fudge_factors = {
		birth_year: 0,
		marriage_year: 0,
		death_year: 0
	};

	this.results_per_page = 15;
	this.display_from_result = 0;

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$location = $location;
	this.ftrees = ftrees;

	for (var param in $stateParams) {
		if ( $stateParams[param] !== undefined ) {
			this.search_params[param] = $stateParams[param];

			// handle fudge factors in query string
			if ( $stateParams[param].indexOf('~') !== -1 ) {
				var parts = this.search_params[param].split('~');
				this.search_params[param] = parts[0];
				this.fudge_factors[param] = parts[1];
			}
			else if ( $stateParams[param].indexOf(';') !== -1 ) {
				var parts = this.search_params[param].split(';');
				this.search_params[param] = parts[0];	
				this.fudge_factors[param] = parts[1];
			}
		}
	};

	//search
	this.search();
};

FtreesController.prototype = {
	search: function() {
		var self = this, 
			search_params = angular.copy(this.search_params);

		if (search_params.ind_index) {
			delete(search_params.ind_index);
		}

		// insert fudge_factors into query string
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
		if (this.selected_individual && this.selected_individual._id.$oid === individual._id.$oid) {
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
		if (this.selected_individual && this.selected_individual._id.$oid === individual._id.$oid) {
			return true;	
		}

		return false;
	}
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', FtreesController]);
