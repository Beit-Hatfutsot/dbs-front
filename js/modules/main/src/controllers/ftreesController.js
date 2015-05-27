var FtreesController = function($scope, $state, $stateParams, $location, ftrees, notification, musicalChairsFactory) {
	var self = this;

	this.individuals = [];
	this._sorted_by = null;
	this.selected_individual = null;
	this.selected_individual_data = {};
	this.search_params = {};
	
	this.key_map = {
		FN: {
			en: 'First Name',
			he: 'שם פרטי',
		},
		
		LN: {
			en:'Last Name',
			he: 'שם משפחה'
		},

		BP: {
			en: 'Birth Place',
			he: 'מקום לידה'
		},

		BD: {
			en: 'Birth Date',
			he: 'תאריך לידה'
		},

		MP: {
			en: 'Marriage Place',
			he: 'מקום נישואין'
		},

		MD: {
			en: 'Marriage Date',
			he: 'תאריך נישואין'
		},

		DP: {
			en: 'Death Place',
			he: 'מקום פטירה'
		},

		DD: {
			en: 'Death Date',
			he: 'מקום פטירה'
		},

		G: {
			en: 'Sex',
			he: 'מין'
		},

		GTN: {
			en: 'Tree Number',
			he: 'מספר עץ'
		}
	};
	
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

	this._results_per_page = 15;
	this.display_from_result = 0;
	this.more_columns_menu = false;
	
	self.result_column_manager = musicalChairsFactory.create_game({
		'FN': true,
		'LN': true,
		'BP': true,
		'BD': true,
		'MP': true,
		'MD': false,
		'DP': false,
		'DD': false,
		'G': false,
		'GTN': false
	}, 5);

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;
	this.musicalChairsFactory = musicalChairsFactory;

	Object.defineProperty(this, 'page_count', {
		get: function() {
			return parseInt(this.individuals.length / this.results_per_page) + 1;
		}
	});

	Object.defineProperty(this, 'current_page', {
		get: function() {
			return parseInt(this.display_from_result / this.results_per_page) + 1;
		},

		set: function(val) {
			this.display_from_result = this.results_per_page * (val - 1);
		}
	});

	Object.defineProperty(this, 'low_page_bound', {
		get: function() {
			var bound = this.current_page - 10; 
			return bound > 0 ? bound : 1;
		}
	});

	Object.defineProperty(this, 'high_page_bound', {
		get: function() {
			var bound = this.current_page + 10;
			return bound < this.page_count ? bound : this.page_count;
		}
	});

	Object.defineProperty(this, 'display_to_result', {
		get: function() {
			var to_result = this.results_per_page + this.display_from_result;
			return to_result < this.individuals.length ? to_result : this.individuals.length;
		}
	});

	Object.defineProperty(this, 'results_per_page', {
		get: function() {
			return this._results_per_page;
		},

		set: function(val) {
			val = parseInt(val);

			if (this.display_from_result) {
				if (val > this.display_from_result) {
					this.display_from_result = this.display_from_result - (val % this.display_from_result);
				}
				else {
					this.display_from_result = this.display_from_result - (this.display_from_result % val);	
				}
			}
			
			this._results_per_page = val;
		}
	});

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

	Object.defineProperty(this, 'tree_item_view', {
		get: function() {
			return $state.includes('ftree-view.ftree-item');
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
		if (newVal) {
			self.minimize_results_table();
		}
		else {
			if (oldVal) {
				self.maximize_results_table();
			}

			self.selected_individual = null;
		}
	});

	//search
	if ($stateParams.last_name !== undefined || $stateParams.birth_place !== undefined) {
		this.search();
	}
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

		// avoid conflict with prameter from state ftree-view.ftree-item
		search_params.tree_number = search_params.filters_tree_number;
		delete search_params.filters_tree_number;

		this.ftrees.search(search_params).
			then(function(individuals) {
				self.individuals = individuals;

				if (self.results_per_page > individuals.length) {
					if (individuals.length === 0) {
						self.results_per_page = 15;
					}
					else {
						self.results_per_page = (individuals.length - individuals.length % 5) || 5;
					}
				}

				self.sort('LN');

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

		if (this.is_selected(individual)) {
			this.selected_index = null;	
			delete(this.$stateParams['ind_index']);
			delete(this.$stateParams['individual_id']);
			delete(this.$stateParams['tree_number']);
			this.$state.go('ftrees', this.$stateParams);
		}
		else {
			self.selected_index = self.individuals.indexOf(individual);

			self.$state.go('ftree-view.ftree-item', {
				ind_index: self.selected_index, 
				individual_id: individual.II, 
				tree_number: individual.GTN
			});
		}
	},

	minimize_results_table: function() {
		for (var key in this.column_status) {
			if (key === 'FN' || key === 'LN') {
				this.column_status[key] = true;
			}
			else {
				this.column_status[key] = false;
			}
		}
	},

	maximize_results_table: function() {
		this.column_status['FN'] = true;
		this.column_status['LN'] = true;
		this.column_status['BP'] = true;
		this.column_status['BD'] = true;
		this.column_status['MP'] = true;
		this.column_status['MD'] = true;
		this.column_status['DP'] = false;
		this.column_status['DD'] = false;
		this.column_status['G'] = false;
		this.column_status['GTN'] = false;
	},

	is_selected: function(individual) {
		if (this.selected_index === this.individuals.indexOf(individual)) {
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
	},

	prevent_dropdown_close: function($event) {
		$event.stopPropagation();
	},

	prev_page: function() {
		if (this.display_from_result - this.results_per_page >= 0) {
			this.display_from_result = this.display_from_result - this.results_per_page;
		}
	},

	next_page: function() {
		if (this.display_from_result + this.results_per_page < this.individuals.length) {
			this.display_from_result = this.display_from_result + this.results_per_page;
		}
	}
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', 'notification', 'musicalChairsFactory', FtreesController]);
