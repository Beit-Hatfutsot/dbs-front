angular.module('main').
	factory('wizard', ['$rootScope', '$http', '$q', 'apiClient', 'cache', 'notification', 'ftrees', '$window',
	function($rootScope, $http, $q, apiClient, cache, notification, ftrees, $window) {

		/**
		 * @ngdoc service
		 * @name wizard
		 *
		 * @description
		 * The Wizard service is in charge of wizard-searching & of keeping search state.
		 */
		var wizard = {

			/**
			 * @ngdoc property
			 * @name wizard#in_progress
			 *
			 * @description
			 * Indicates that the wizard service is busy.
			 */
			in_progress: false,


			/**
			 * @ngdoc property
			 * @name wizard#failed
			 *
			 * @description
			 * Indicates that a wizard operation has failed.
			 */
			failed: false,

			/**
			 * @ngdoc property
			 * @name wizard#query
			 *
			 * @description
			 * An object representing the current wizard query.
			 * Once a wizard search is triggered, this query will be used.
			 * The query holds two strings: a name and a place.
			 */
			query: {
				name: '',
				place: ''
			},

			/**
			 * @ngdoc property
			 * @name wizard#result
			 *
			 * @description
			 * The result of the last wizard search.
			 */
			result: {},
			

			/**
			 * @ngdoc property
			 * @name wizard#search_status
			 *
			 * @description
			 * Wizard search status.
			 */
			search_status: '',


			/**
			 * @ngdoc property
			 * @name wizard#last_search
			 *
			 * @description
			 * Last wizard search.
			 */
			last_search: {
				name: '',
				place: ''
			},
			
			/**
			 * @ngdoc method
			 * @name wizard#clear
			 *
			 * @description
			 * Clear wizard result and search status.
			 */
			clear: function() {
				this.result = {};
				this.search_status = '';
			},
			
			/**
			 * @ngdoc method
			 * @name wizard#search
			 *
			 * @description
			 * Triggers a wizard search using the wizard query.
			 * Sets search_status, last_search, result.
			 * Filters (live) individual data.
			 * It also handles notifications.
			 * 
			 * @returns
			 * {Promise}
			 */
			search: function() {
	  			if ( !(this.in_progress) ) {

	  				if ($window.sessionStorage.wizard_result) {
	  					$window.sessionStorage.removeItem("wizard_result");
	  				}

	  				this.in_progress = true;

					notification.put({
	                    en: 'Searching...',
	                    he: 'מחפש...'
	                });

		  			var self = this, 
		  				query_params = {},
		  				query = this.query,
		  				search_promise,
		  				deferred = $q.defer();

		  			// make sure there are no empty strings in the request query params
		  			if (query.name) {
		  				query_params.name = query.name;
		  			}
		  			if (query.place) {
		  				query_params.place = query.place;
		  			}
		  			
		  			$http.get(apiClient.urls.wizard_search, {
						params: query_params
					}).
					success(function(result) {
						// set search status
						var search_status;

						// filter living individuals
		                if ( result.individuals.isNotEmpty() ) {
		                	result.individuals = ftrees.filter_individuals(result.individuals);
		                }

		                if ( result.name.isNotEmpty() || result.place.isNotEmpty() || result.individuals.isNotEmpty() )  {
		                    
		                	if (result.name.isNotEmpty()) {
		                		cache.put(result.name);
		                	}
		                	
	                		if (result.place.isNotEmpty()) {
		                		cache.put(result.place)
		                    }

		                    if ( result.name.isNotEmpty() && result.place.isEmpty() ) {
		                        self.search_status = 'bingo-name';
		                        notification.put({
	                                en: 'We have not found a community to match your search.',
	                                he: 'לא מצאנו את הקהילה שחיפשתם.'
	                            });
		                    }
		                    else if ( result.name.isEmpty() && result.place.isNotEmpty() ) {
		                        self.search_status = 'bingo-place';
		                        notification.put({
	                                en: 'We have not found a surname to match your search.',
	                                he: 'לא מצאנו את שם המפשחה שחיפשתם.'
	                            });		                
		                    }
		                    else {
		                        self.search_status = 'bingo';
		                        notification.put({
	                                en: 'Search finished successfully.',
	                                he: 'החיפוש הסתיים בהצלחה.'
	                            });
		                    }
		                }
		                else {
		                    self.search_status =  'none';
		                    notification.put({
                                en: 'We have not found a surname and a community to match your search.',
                                he: 'לא מצאנו את שם המשפחה והקהילה שחיפשתם.'
                            });
		                }

						self.result = result;
						$window.sessionStorage.setItem('wizard_result', JSON.stringify(result));
						self.last_search.name = self.query.name;
						self.last_search.place = self.query.place;

						deferred.resolve(search_status);
					}).
					error(function() {
						notification.put({
		                    en: 'Search has failed.',
		                    he: 'החיפוש נכשל.'
		                });
		                self.failed = true;
						deferred.reject();
					}).
		  			finally(function() {
						self.in_progress = false;
						$rootScope.$broadcast('wizard-search-end');
					});

		  			return deferred.promise;
			  	}
			}
		};

		return wizard;
	}]);
