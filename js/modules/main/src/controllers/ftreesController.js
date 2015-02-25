var FtreesController = function($scope, $state, $stateParams, $location, ftrees, notification, musicalChairsFactory) {
	var self = this;

	this.individuals = [];
	this._sorted_by = null;
	this.selected_individual = null;
	this.selected_individual_data = {};
	this.search_params = {};
	this.search_modifiers = {
		first_name: 	'',
		last_name: 		'',
		birth_place: 	'',
		marriage_place: '',
		death_place: 	''
	};
	this.fudge_factors = {
		birth_year: 	0,
		marriage_year: 	0,
		death_year: 	0
	};
	this.results_per_page = 15;
	this.display_from_result = 0;
	this.more_columns_menu = true;
	this.result_column_manager = {
		player_status: {}
	};

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;
	this.musicalChairsFactory = musicalChairsFactory;

	Object.defineProperty(this, 'sorted_by', {
		get: function() {
			return this._sorted_by;
		},

		set: function(key) {
			this.sort(key);
		}
	});
	
	Object.defineProperty(this, 'column_status', {
		get: function() {
			return this.result_column_manager.player_status;
		}
	});

	Object.defineProperty(this, 'tree_view', {
		get: function() {
			return $state.includes('ftree-view');
		}
	});

	Object.defineProperty($scope, 'tree_view', {
		get: function() {
			return self.tree_view;
		}
	});

	for (var param in $stateParams) {
		if ( $stateParams[param] !== undefined ) {

			// handle search modifiers & fudge factors in query string
			if ( $stateParams[param].indexOf('~') !== -1 ) {
				var parts = $stateParams[param].split('~');
				this.search_params[param] = parts[0];
				this.fudge_factors[param] = parts[1];
			}
			else if ( $stateParams[param].indexOf(';') !== -1 ) {
				var parts = $stateParams[param].split(';');
				this.search_params[param] = parts[0];	
				this.search_modifiers[param] = parts[1];
			}
			else {
				this.search_params[param] = $stateParams[param];
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
	window.ctrl = this
};

FtreesController.prototype = {
	search: function() {
		var self = this, 
			search_params = angular.copy(this.search_params);

		for (var param in search_params) {
			if (search_params[param] === '') {
				delete search_params[param];
			}
		}

		this.notification.put({
			en:'Searching family trees...',
			he: 'מחפש בעצי משפחה...'			
		});

		if (search_params.ind_index) {
			delete(search_params.ind_index);
		}

		// insert search modifiers & fudge_factors into query string
		for (var modifier in this.search_modifiers) {
			var modifier_string = this.search_modifiers[modifier]; 
			if (search_params[modifier] !== undefined && modifier_string !== '') {
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
				self.sort('LN');

				var keys = [];
				for (var key in individuals[0]) {
					keys.push(key);
				}
				self.result_column_manager = self.musicalChairsFactory.create_game({
					'FN': true,
					'LN': true,
					'BP': true,
					'BD': true,
					'MP': true,
					'MD': true,
					'DP': false,
					'DD': false,
					'G': false,
					'GTN': false
				}, 6);

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
			}).
			finally(function() {
				for (var param in self.search_params) {
					self.$location.search(param, search_params[param]);	
				}
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
			this.ftrees.get_data(individual.GTN).
				then(function(tree_data) {
					self.selected_individual = self.ftrees.parse_individual(individual);

					self.notification.put({
						en: 'Family tree successfully loaded.',
						he: 'עץ משפחה נטען בהצלחה.'
					});

					self.$state.go('ftree-view', {ind_index: self.individuals.indexOf(individual)});	
				}, function() {
					console.log(individual)
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
	},

	sort: function(key) {
		if (this._sorted_by === key) {
			this.individuals.sort(function(a, b) {
				if ( a[key] && (a[key] > b[key]) ) {
					return -1;
				}
				if ( !a[key] || (a[key] < b[key]) ) {
					return 1;
				}
				return 0;
			});

			this._sorted_by = key + '_inverse';
		}
		else {
			this.individuals.sort(function(a, b) {
				if ( a[key] && (a[key] < b[key]) ) {
					return -1;
				}
				if ( (!a[key] || (a[key]) > b[key]) && b[key] ) {
					return 1;
				}
				if ( !(b[key]) ) {
					return -1;
				}
				return 0;
			});

			this._sorted_by = key;
		}
	}
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', 'notification', 'musicalChairsFactory', FtreesController]);
