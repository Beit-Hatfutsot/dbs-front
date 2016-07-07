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

					notification.loading(true);

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
						notification.loading(false);

		                if ( result.name.isNotEmpty() || result.place.isNotEmpty())  {

		                	if (result.name.isNotEmpty()) {
		                		cache.put(result.name);
		                	}

	                		if (result.place.isNotEmpty()) {
		                		cache.put(result.place)
		                    }

		                    if ( result.name.isNotEmpty() && result.place.isEmpty() ) {
		                        self.search_status = 'bingo-name';
								if (query_params.place)
									notification.put(13);
		                    }
		                    else if ( result.name.isEmpty() && result.place.isNotEmpty() ) {
		                        self.search_status = 'bingo-place';
								if (query_params.name)
									notification.put(14);
		                    }
		                    else {
		                        self.search_status = 'bingo';
		                    }
		                }
		                else {
		                    self.search_status =  'none';
		                }

						self.result = result;
						$window.sessionStorage.setItem('wizard_result', JSON.stringify(result));
						self.last_search.name = self.query.name;
						self.last_search.place = self.query.place;

						deferred.resolve(search_status);
					}).
					error(function() {
						notification.put(11);
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
