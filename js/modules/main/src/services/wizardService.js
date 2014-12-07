angular.module('main').
	factory('wizard', ['$resource', '$q', 'apiClient', 'cache', 'notification', function($resource, $q, apiClient, cache, notification) {
		
		var searchClient = $resource(apiClient.urls.wizard_search);

		var wizard = {
			in_progress: false,

			failed: false,

			result: {},
			
			search_status: '',

			last_search: {
				name: '',
				place: ''
			},
			
			clear: function() {
				this.result = {};
				this.search_status = '';
			},
			
			search: function(name, place) {
	  			if ( !(this.in_progress) ) {
	  				
					notification.put({
	                    en: 'Searching...',
	                    he: 'מחפש...'
	                });

	  				this.in_progress = true;

		  			var self = this, 
		  				search_promise,
		  				deferred = $q.defer();
		  			
		  			search_promise = searchClient.get({
						name: name || '',
						place: place || ''	
					}).$promise;
		  					
					search_promise
						.then(function(result) {
							// set search status
							var search_status;

			                if ( result.bingo.name.isNotEmpty() || result.bingo.place.isNotEmpty() )  {
			                    
			                    if ( result.bingo.name.isNotEmpty() && result.bingo.place.isEmpty() ) {
			                        self.search_status = 'bingo-name';
			                        notification.put({
		                                en: 'We have not found a community to match your search.',
		                                he: 'לא מצאנו את הקהילה שחיפשתם.'
		                            });
			                    }
			                    else if ( result.bingo.name.isEmpty() && result.bingo.place.isNotEmpty() ) {
			                        self.search_status = 'bingo-place';
			                        notification.put({
		                                en: 'We have not found a surname to match your search.',
		                                he: 'לא מצאנו את שם המפשחה שחיפשתם.'
		                            });		                
			                    }
			                    else {
			                        self.search_status = 'bingo';
			                        notification.put({
		                                en: 'Search finished successfuly.',
		                                he: 'החיפוש הסתיים בהצלחה.'
		                            });
			                    }
			                }
			                else {
			                    self.search_status =  'none';
			                    notification.put({
	                                en: 'We have not found a surname and a community to match your search.',
	                                he: 'לא מצאנו את שם המפשחה והקהילה שחיפשתם.'
	                            });
			                }

							self.result = result;
							self.last_search.name = name;
							self.last_search.place = place;
							angular.forEach(result.bingo, function(item) {
								cache.put(item)
							});
						
							deferred.resolve(search_status);
						},
						function() {
							notification.put({
			                    en: 'Search has failed.',
			                    he: 'החיפוש נכשל.'
			                });
			                self.failed = true;
							deferred.reject();
						}).
						finally(function() {
							self.in_progress = false;
						});

		  			return deferred.promise;
			  	}
			}
		};

		return wizard;
	}]);