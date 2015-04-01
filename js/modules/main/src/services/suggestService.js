angular.module('main').
	factory('suggest', ['$http', 'apiClient', function($http, apiClient) {

		var collection_name_map = {
			names: 'familyNames', 
			places: 'places'
		},

		suggest = {

			failed: false,
			in_progress: false,

			suggested: {
				names: [],
				places: [],
				distribution: { 
					names: [5, 5, 5],
					places: [5, 5, 5]
				}
			},

			suggest_names: function(name) {
				return get_suggestions('names', name);
			},

			suggest_places: function(place) {
				return get_suggestions('places', place);	
			}
		};	

		function get_suggestions(what, value) {
			if ( !(suggest.in_progress) ) {
				suggest.in_progress = true;

				var count;

				return $http.get(apiClient.urls.suggest + '/' + collection_name_map[what] + '/' + value).
					success(function(response) {
						suggest.suggested[what] = [];
						suggest.suggested.distribution[what] = [];

						['starts_with', 'contains', 'phonetic'].forEach(function(group) {
							count = 0;

							response[group].forEach(function(suggestion) {
								if (suggest.suggested[what].indexOf(suggestion) === -1) {
									suggest.suggested[what].push(suggestion);
									count++;		
								}
							});

							// save the number of suggestions in group
							suggest.suggested.distribution[what].push( count );
						});
					}).
					error(function() {
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
