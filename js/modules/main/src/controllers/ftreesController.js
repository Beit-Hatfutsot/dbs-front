var FtreesController = function($scope, $state, $stateParams, ftrees, notification, $timeout, $modal, $window) {

	var self = this;

	this.individuals = [];
	this.search_params = {};
	this.query = '';
	
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
	this.$window = $window;
	this.ftrees = ftrees;
	this.notification = notification;

	Object.defineProperty($scope, '$stateParams', {
		get: function() {
			return $stateParams;
		}
	}); 

	//search
	var parameters = [];
		for (var key in $stateParams) {
			if ($stateParams[key]) {

				// read state params & update bound objects to update view accordingly
					if (key !== 'more') {
							parameters.push($stateParams[key]);

						// handle search modifiers & fudge factors in query string
						if ( $stateParams[key].indexOf('~') !== -1 ) {
							var parts = $stateParams[key].split('~');
							self.search_params[key] = parts[0];
							self.fudge_factors[key] = parts[1];
						}
						else if ( $stateParams[key].indexOf(';') !== -1 ) {
							var parts = $stateParams[key].split(';');
							self.search_params[key] = parts[0];	
							self.search_modifiers[key] = parts[1];
						}
						else {
							self.search_params[key] = $stateParams[key];
						}
					}
			}
		};
		this.query = parameters.join(' + ');
		var temp = angular.copy($stateParams);
		delete temp.more;
		self.search(temp);


	if ($state.lastState.name !== 'ftrees') {
		$timeout(function(){
		    var body = angular.element(document.getElementsByTagName('body')[0]);
			body.addClass('backdrop');
		    $modal.open({
		     	templateUrl: 'templates/main/ftrees/ftrees-welcome-message.html',
		     	size: 'ftree'
		    }).result.finally(function(){
		    	body.removeClass('backdrop');
		    })
		}, 1000)
	};
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
		this.ftrees.search(search_params).
			then(function (r){
				self.individuals.items = self.individuals.items.concat(r.items);
			});
    },

    toggle_more: function() {
    	var params = this.$stateParams;

    	if (params.more == '0' || params.more == undefined) {
    		params.more = '1';
    		this.$state.go('ftrees', params);
    	}
    	else {
     		params.more = '0';
    		this.$state.go('ftrees', params);
    	}
    },

	update: function() {
		var search_params = angular.copy(this.search_params);

		for (var param in search_params) {
			if (search_params[param] === '') {
				delete search_params[param];
			}
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
		search_params.more = this.$stateParams.more;
		this.$state.go('ftrees', search_params, {inherit: false});
		this.$window.sessionStorage.setItem('ftrees_search_params', JSON.stringify(search_params));
	},

 	clear_filters: function() {
 		for (var parameter in this.search_params) {
 			this.search_params[parameter] = '';
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

angular.module('main').controller('FtreesController', ['$scope', '$state', '$stateParams', 'ftrees', 'notification', '$timeout', '$modal', '$window', FtreesController]);
