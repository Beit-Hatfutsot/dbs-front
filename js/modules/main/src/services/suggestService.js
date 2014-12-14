angular.module('main').
	factory('suggest', ['$resource', 'apiClient', function($resource, apiClient) {
		
		var searchClient = $resource(apiClient.urls.suggest + '/:what/:value');

		var suggest = {

			failed: false,
			in_progress: false,

			suggested: {
				names: [],
				places: []
			},

			suggest_names: function(name) {
				get_suggestions('names', name);
			},

			suggest_places: function(place) {
				get_suggestions('places', place);	
			}
		};	

		function get_suggestions(what, value) {
			if ( !(suggest.in_progress) ) {
				suggest.in_progress = true;

				searchClient.get({what: what, value: value}).$promise.
					then(function(response) {
						suggest.suggested[what] = response[what];
					},
					function() {
						suggest.failed = true;
						suggest.suggested[what] = [];
					}).
					finally(function() {
						suggest.in_progress = false;
					});
			}
		}

		return suggest;
	}]);