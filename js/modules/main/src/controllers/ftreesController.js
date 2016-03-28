var FtreesController = function($scope, $state, $stateParams, $location, ftrees, notification, musicalChairsFactory, $http, apiClient) {
	var self = this;

	this.individuals = [];
	this.$http = $http;
	this._sorted_by = null;
	this.selected_individual = null;
	this.selected_individual_data = {};
	this.search_params = {};
	this.query = '';
	this.advanced_search = false;
	this.apiClient = apiClient;
	
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
	this.marriage_info = false;
	this.candidate_page = '';
	this.more_indi_info = false;
	
	self.result_column_manager = musicalChairsFactory.create_game({
		'FN': true,
		'LN': true,
		'BP': true,
		'BD': true,
		'MP': true,
		'MD': false	,
		'DP': false,
		'DD': false,
		'G': false,
		'GTN': true
	}, 6, 4);

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;

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

	Object.defineProperty($scope, '$stateParams', {
		get: function() {
			return $stateParams;
		}
	});

	$scope.$watch('tree_view', function(newVal, oldVal) {
		if (newVal) {
			self.result_column_manager.force(['FN', 'LN']);
		}
		else {
			if (oldVal) {
				self.maximize_results_table();
			}

			self.selected_individual = null;
		}
	});

	$scope.$watchCollection('$stateParams', function (newParams) {
	    var search = $location.search();

	    if (angular.isObject(newParams)) {
	      angular.extend(search, newParams);
	    }

	    $location.search(search).replace();
	});

	//search
	var BreakException= {};
	var parameters = [];
	try {
		Object.keys($stateParams).forEach(function(key) {
			if ($stateParams[key]) {

				// read state params & update bound objects to update view accordingly
				for (var param in $stateParams) {
					if ( $stateParams[param] !== undefined ) {
						parameters.push($stateParams[param]);

						// handle search modifiers & fudge factors in query string
						if ( $stateParams[param].indexOf('~') !== -1 ) {
							var parts = $stateParams[param].split('~');
							self.search_params[param] = parts[0];
							self.fudge_factors[param] = parts[1];
						}
						else if ( $stateParams[param].indexOf(';') !== -1 ) {
							var parts = $stateParams[param].split(';');
							self.search_params[param] = parts[0];	
							self.search_modifiers[param] = parts[1];
						}
						else {
							self.search_params[param] = $stateParams[param];
						}
					}
					self.query = parameters.join(' + ');
				};

				self.search($stateParams);
				throw BreakException;
			}
		});
	}
	catch(e) {
		 if (e !== BreakException) throw e;
	}
};

FtreesController.prototype = {
	search: function(search_params) {
		var self = this;

		this.notification.put({
			en:'Searching family trees...',
			he: 'מחפש בעצי משפחה...'			
		});

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
			});
	},

	fetch_more: function() {
		var self = this;
		var search_params = angular.copy(this.search_params);
		search_params.start = self.individuals.items.length;
		var individuals = self.individuals;
        self.$http.get(self.apiClient.urls.ftrees_search, {params: search_params})
        .success(function (r){
            self.individuals.items = individuals.items.concat(r.items);
        });
    }, 

	update: function() {
		var self = this;
		var search_params = angular.copy(this.search_params);

		for (var param in search_params) {
			if (search_params[param] === '') {
				delete search_params[param];
			}
		}

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

		// avoid conflict with parameter from state ftree-view.ftree-item
		search_params.tree_number = search_params.filters_tree_number;
		delete search_params.filters_tree_number;

		for (var param in this.search_params) {
			this.$location.search(param, search_params[param]);
		}
	},

	go_to_page: function(page_number) {
		if(page_number <= this.page_count && page_number >= 1) {
			this.current_page  = page_number;
		}
				
	},

	back_to_search_filters: function () {
		this.$state.go('ftrees');
	}, 

	clear_filters: function() {
		for (var modifier in this.search_modifiers) {
			this.search_params[modifier] = '';
		}
	},

	get_href: function (individual) {
		// TODO: support languages
		return this.$state.href('person-view', {tree_number: individual.GTN,
							   			   node_id: individual.II});
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
	},

	read_about_center: function (collection_name) {
        this.$state.go('about_center', {collection: collection_name});
    }
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', 'notification', 'musicalChairsFactory', '$http', 'apiClient', FtreesController]);
