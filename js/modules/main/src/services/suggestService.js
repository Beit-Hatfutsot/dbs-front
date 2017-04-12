/**
 * @ngdoc service
 * @name suggest
 * @module main
 *
 * @description
 * Handles search suggestions.
 */
angular.module('main').
	factory('suggest', ['$http', 'apiClient', function($http, apiClient) {

		var collection_name_map = {
			names: 'familyNames',
			places: 'places',
			general: '*'
		},

		suggest = {

			failed: false,

			suggested: {
				names: {
					exact: [],
					starts_with: [],
					contains: [],
					phonetic: []
				},
				places: {
					exact: [],
					starts_with: [],
					contains: [],
					phonetic: []
				},
				general: {
					exact: [],
					starts_with: [],
					contains: [],
					phonetic: []
				}
			},

			suggest_names: function(name) {
				return get_suggestions('names', name);
			},

			suggest_places: function(place) {
				return get_suggestions('places', place);
			},
			suggest_general: function(query) {
				return get_suggestions('general', query);
			}
		};

		function get_suggestions(what, value) {

				var count, exact, all_suggestions;
				var value_lc = value.toLowerCase();

				return $http.get(apiClient.urls.suggest + '/' + collection_name_map[what] + '/' + value).
					success(function(response) {
						suggest.suggested = {
							names: {
								exact: [],
								starts_with: [],
								contains: [],
								phonetic: []
							},
							places: {
								exact: [],
								starts_with: [],
								contains: [],
								phonetic: []
							},
							general: {
								exact: [],
								starts_with: [],
								contains: [],
								phonetic: []
							}
						};
						exact = null;
						all_suggestions = [];

						['starts_with', 'contains', 'phonetic'].forEach(function(group) {
							if (what == 'general') {
								for (var collection in response[group]) {
									for(var i=0; i<response[group][collection].length; i++) {
										var suggestion = response[group][collection][i];

								    	if (suggestion.toLowerCase() === value_lc) {
											exact = suggestion;
										}
										else {
											all_suggestions	= suggest.suggested[what].starts_with.
												concat(suggest.suggested[what].contains.
													concat(suggest.suggested[what].phonetic)
												);

											if (all_suggestions.indexOf(suggestion) === -1) {
												suggest.suggested[what][group].push(suggestion);
											}
										}
									}
								}

							}
							else {
								response[group].forEach(function(suggestion) {
									if (suggestion.toLowerCase() === value_lc) {
											exact = suggestion;
									}
									else {
										all_suggestions	= suggest.suggested[what].starts_with.
											concat(suggest.suggested[what].contains.
												concat(suggest.suggested[what].phonetic)
											);

										if (all_suggestions.indexOf(suggestion) === -1) {
											suggest.suggested[what][group].push(suggestion);
										}
									}
								})
							}
						});

						if (exact) {
							suggest.suggested[what].exact.push(exact);
						}
					}).
					error(function() {
						suggest.failed = true;
					}).
					finally(function() {
						suggest.in_progress = false;
					});
		}

		return suggest;
	}]);
