var FtreesController = function($scope, $state, $stateParams, $location, ftrees, notification) {
	var self = this;

	this.individuals = [];
	this.search_params = {};
	this.query = '';
	this.advanced_search = false;
	

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

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;

	Object.defineProperty($scope, '$stateParams', {
		get: function() {
			return $stateParams;
		}
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

				self.notification.put({
					en: 'Family Trees Search has finished successfully.',
					he: 'חיפוש בעצי משפחה הסתיים בהצלחה.'
				});

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
		this.ftrees.search(search_params).
			then(function (r){
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

	get_href: function (individual) {
		// TODO: support languages
		return this.$state.href('person-view', {tree_number: individual.GTN,
							   			   node_id: individual.II});
	},

	read_about_center: function (collection_name) {
        this.$state.go('about_center', {collection: collection_name});
    }
};

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', '$location', 'ftrees', 'notification', FtreesController]);
