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
					Articles: [],
					People: [],
					Media: []
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

				return $http.get(apiClient.urls.suggest + '/' + collection_name_map[what] + '/' + value)
					.success(function(response) {
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
							general: {}
						};

						if (what == 'general') {
							var sections = {'Articles': [], 'People': [], 'Media': []};
							for (var collection in response.starts_with) {
								for(var i=0; i<response.starts_with[collection].length; i++) {
									var suggestion = response.starts_with[collection][i];
									// collection == "familyNames"
									// suggestion == "Hoch"
									if (["familyNames", "places"].indexOf(collection) > -1) {
										sections["Articles"].push(suggestion);
									} else if (["persons", "personalities"].indexOf(collection) > -1) {
										sections["People"].push(suggestion);
									} else if (["photoUnits", "movies"].indexOf(collection) > -1) {
										sections["Media"].push(suggestion);
									}
								}
							}

							Object.keys(sections).forEach(function(section) {
									sections[section].sort();
									//remove duplicates
									var sorted_arr = [];
									for (var i = 0; i < sections[section].length - 1; i++) {
									    if (sections[section][i + 1] !== sections[section][i]) {
									        sorted_arr.push(sections[section][i]);
									    }
									}
									//return no more than 6 results
									sections[section] = sorted_arr.slice(0, 6);
							})

							suggest.suggested[what] = sections;
						}
						else {
							exact = null;
							all_suggestions = [];
							['starts_with', 'contains', 'phonetic'].forEach(function(group) {
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
							});
							if (exact) {
								suggest.suggested[what].exact.push(exact);
							}
						};

					})
					.error(function() {
						suggest.failed = true;
					}).
					finally(function() {
						suggest.in_progress = false;
					});
		}

		return suggest;
	}]);
