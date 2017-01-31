var PersonsController = function($rootScope, $scope, $state, $stateParams, ftrees, notification, $timeout, $uibModal, $window, $location) {

	var self = this,
		advanced_fields = ['birth_place', 'marriage_place', 'death_place', 'tree_number', 'birth_year', 'marriage_year', 'death_year'];
	this.individuals = [];
	this.search_params = {};
	this.query = '';
	this.$rootScope = $rootScope;

	this.search_modifiers = {
		first_name: 	'',
		last_name: 		'',
		birth_place: 	'',
		marriage_place: '',
		death_place: 	'',
		place:          ''
	};
	this.tree_number = parseInt($stateParams['tree_number']);

	this.$state = $state;
	this.$stateParams = $stateParams;
	this.$scope = $scope;
	this.$window = $window;
	this.$location = $location;
	this.ftrees = ftrees;
	this.notification = notification;
	this.persons_welcome_msg = ($window.sessionStorage.getItem('persons-welcome-msg') == 'dismissed') ||
		  					   ($window.localStorage.getItem('persons-welcome-msg') == 'dismissed');

	Object.defineProperty($scope, '$stateParams', {
		get: function() {
			return $stateParams;
		}
	});

   	$rootScope.$on('$stateChangeStart',
	    function(event, toState, toParams, fromState, fromParams) {
		  	var str = 'persons';
		  	var from_person_state = fromState.name.indexOf(str, fromState.name.length - str.length) !== -1;
		  	var to_person_state = toState.name.indexOf(str, toState.name.length - str.length) !== -1;

		  	if (to_person_state && from_person_state && fromParams.more != toParams.more) {
		  		event.preventDefault();
			  	self.$state.transitionTo(toState.name, toParams, {notify: false});
		  	}
	});

	if (!self.persons_welcome_msg) {

		var modalInstance = $uibModal.open({
		     	templateUrl: 'templates/main/ftrees/persons-welcome-message.html',
		     	controller: 'PersonsWelcomeCtrl',
		     	animation: true,
		     	size: 'ftree'
	    });

		modalInstance.result.then(function () {
		    $window.localStorage.setItem('persons-welcome-msg', 'dismissed');

		}, function () {
		    $window.sessionStorage.setItem('persons-welcome-msg', 'dismissed');
		});
	};


	//search
	var query = {},
	    parameters = [],
	    advanced = $stateParams['more']=='1';

	for (var key in $stateParams) {
		if ($stateParams[key]) {
			// read state params & update bound objects to update view accordingly
			var val = $stateParams[key];
			if (key !== 'more') {
				if (advanced || (advanced_fields.indexOf(key) == -1)) {
					parameters.push(val);
					query[key] = val;
				}

				// handle search modifiers & fudge factors in query string
				if ( val.indexOf(';') !== -1 ) {
					var parts = val.split(';');
					self.search_params[key] = parts[0];
					self.search_modifiers[key] = parts[1];
				}
				else {
					if(key !== 'tree_number') {
						self.search_params[key] = $stateParams[key];
					}
					else
						self.search_params[key] = parseInt($stateParams[key]);
				}
			}
		}
	};
	if (parameters.length > 0) {
		this.query = parameters.join(' + ');
		self.search(query);
	};
};

PersonsController.prototype = {
	search: function(search_params) {
		var self = this;
		this.notification.loading(true);
		this.ftrees.search(search_params).
			then(function(individuals) {
				self.individuals = individuals;
				self.$rootScope.$broadcast('item-loaded', individuals.items);
				self.notification.loading(false);
				if (individuals.total == 0)
					self.notification.put(3);


			}, function() {
				self.notification.put(500);
			});
	},

	fetch_more: function() {
		var self = this;
		this.notification.loading(true);
		var search_params = angular.copy(self.search_params);
		search_params.start = self.individuals.items.length;
		this.handle_search_modifiers(search_params);
		this.ftrees.search(search_params).
			then(function (r){
				self.individuals.items = self.individuals.items.concat(r.items);
				self.notification.loading(false);
			});
    },

    toggle_more: function() {
    	var param = this.$stateParams;
    	if (param.more == '0' || param.more == undefined) {
    		param.more = '1';
    		if(this.search_params.place) {
    			this.search_params.birth_place = this.search_params.place;
    			this.search_params.place = '';
    		}
    	}
    	else {
     		param.more = '0';
     		if(this.search_params.birth_place) {
     			this.search_params.place = this.search_params.birth_place;
     			this.search_params.birth_place = '';
     		}
    	}
    	this.$location.search(param);
    },

    handle_search_modifiers: function(search_params) {
		for (var modifier in this.search_modifiers) {
			if (modifier in search_params) {
				var modifier_string = this.search_modifiers[modifier];
				if (this.search_params[modifier] !== undefined && modifier_string !== '') {
					search_params[modifier] += ';' + modifier_string;
				}
			}
		}
    },

	update: function() {
		var self = this;
		var search_params = angular.copy(this.search_params);
		for (var param in search_params) {
			if (search_params[param] === '' || search_params[param] == undefined) {
				delete search_params[param];
			}
		}
		this.handle_search_modifiers(search_params);
		search_params.more = this.$stateParams.more;
		var prev_search = this.$window.sessionStorage.getItem('ftrees_search_params');
		if (JSON.stringify(search_params) === prev_search) {
			self.notification.put(20);
		}
		this.$state.go('persons', search_params, {inherit: false});
		this.$window.sessionStorage.setItem('ftrees_search_params', JSON.stringify(search_params));
	},



 	clear_filters: function() {
 		for (var parameter in this.search_params) {
 			this.search_params[parameter] = '';
 			this.$location.search(parameter, null);
 		}
 	},

	get_href: function (individual) {
		// TODO: support languages
		return this.$state.href('person-view', {tree_number: individual.GTN,
							   			   node_id: individual.II});
	},

	read_about_center: function (collection_name) {
        this.$state.go('about_center', {collection: collection_name});
    },
};

angular.module('main').controller('PersonsController', ['$rootScope', '$scope', '$state', '$stateParams', 'ftrees', 'notification', '$timeout', '$uibModal', '$window', '$location', PersonsController]);
