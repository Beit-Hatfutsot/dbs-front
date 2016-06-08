angular.module('auth').

	factory('auth', [
	'$modal', '$state', '$location', '$http', 'apiClient', '$q', '$window', '$rootScope', 'user',
	function($modal, $state, $location, $http, apiClient, $q, $window, $rootScope, user) {
		/**
		 * @ngdoc service
		 * @name auth
		 *
		 * @description
		 * A service to handle user signin, signout & registration.
		 */
		var auth = {

			/**
		     * @ngdoc property
		     * @name auth#in_progress
		     *
		     * @description
		     * Indicates that an auth request is in progress.
		     */
			user: null,
			in_progress: false,

	  		/**
	  		 * @ngdoc method
		     * @name auth#authenticate
			 * 
			 * @param {Object} config 
			 * Configuration object
			 * Configuration parameters:
			 *  - **register** – `{boolean}` – set to true to open a Register dialog.
		     *  - **next_state** – `{String}` – Name of state to go to upon succesful signin/registration.
		     *  - **fallback_state** – `{String}` – Fallback state name to go to upon failed authentication.
		     *  - **fallback_state_params** – `{Object}`.
			 *
			 * @description
			 * A call to this method opens a Sign-in/Register dialog (modal). 
		     */
	  		authenticate: function(config) {

	  			if ( !(this.is_signedin()) ) {
				    var authModalInstance = $modal.open({
				     	templateUrl: 'templates/auth/auth_modal.html',
				     	controller: 'AuthCtrl as authController',
				     	size: 'sm',
				     	resolve: {
				     		config: function () { return config; }
				     	}
				    });
					authModalInstance.result.finally(function() {
						if(config.mandatory) {
							$state.go(config.fallback_state);
						}
				    })
				}
		  	},

		  	/**
	  		 * @ngdoc method
		     * @name auth#signin
		     * 
		     * @param email {String} user email
			 * 
			 * @description
			 * Sign a user in:
			 * Sends a request to the auth API endpoint with user credentials.
			 *
			 * @returns
			 * {Promise}
			 */
		  	signin: function(email) {
		  		if ( !this.in_progress ) {
		  			this.in_progress = true;

		  			this.signout();

			  		var self = this,
					 	signin_deferred = $q.defer();

					try {
				  		$http.post(apiClient.urls.login, {
				    		email: email,
							next:  $location.path()
				    	}).
				    	success(function(response) {
							if (response.meta.code == 200)
								signin_deferred.resolve()
							else
								signin_deferred.reject();
				    	}).
				    	error(function() {
				    		signin_deferred.reject();
				    	}).
				    	finally(function() {
							self.in_progress = false;
		  				});
				    }
				    catch(e) {
				    	signin_deferred.reject();
				    }

	  				return signin_deferred.promise;
		  		}
		  	},

		  	login: function(token) {
				var self = this;
		  		if ( !this.in_progress ) {
		  			this.in_progress = true;

		  			this.signout();

			  		var self = this,
					 	login_deferred = $q.defer();

					try {
						var url = apiClient.urls.login;
				  		$http.get(url+'/'+token, {
							headers: {Accept: 'application/json'}
						}).then(function(response) {
								if (response.data.meta.code == 200) {		
								   // success
									var auth_token = response.data.response.user.authentication_token;
									if (auth_token) {
										$window.localStorage.setItem('bhsclient_token', auth_token);
										user.get().$promise.then(function(user) {
											self.user = user
											$rootScope.$broadcast('loggedin', user);
											login_deferred.resolve();
										});
									} else {
										login_deferred.reject(response);
									}
								} else 
									login_deferred.reject(response);

							}, function(response) {
								// failure
								login_deferred.reject(response);
							}).
							finally(function() {
								self.in_progress = false;
							});
				    }
				    catch(e) {
				    	login_deferred.reject();
				    }

	  				return login_deferred.promise;
		  		}
		  	},

		  	/**
	  		 * @ngdoc method
		     * @name auth#signout
			 * 
			 * @description
			 * Signs a signed-in user out.
			 */
		  	signout: function() {
		  		$window.localStorage.removeItem('bhsclient_token');
		  	},

		  	/**
	  		 * @ngdoc method
		     * @name auth#is_signedin
			 * 
			 * @description
			 * Checks localStorage for data indicating a signed-in user.
			 *
			 * @returns
			 * {boolean}
			 */
		  	is_signedin: function() {
		  		if ( $window.localStorage.getItem('bhsclient_token')) {
		  			return true;
		  		}
		  		else {
		  			return false;
		  		}
		  	},

		  	/**
	  		 * @ngdoc method
		     * @name auth#get_token
			 * 
			 * @description
			 * The authentication token is saved in `localStorage`,
			 * and is added to every subsequent request to the API.
			 * This method retrieves the token from `localStorage`.
			 *
			 * @returns
			 * {String} authentication token, or `false` if not signed-in.
			 */
		  	get_token: function() {
		  		return this.is_signedin() ? $window.localStorage.getItem('bhsclient_token') : false;
		  	}
	  	};
		if (auth.is_signedin()) {
			user.get().$promise.then(function(user) {
				auth.user = user
				$rootScope.$broadcast('loggedin', user);
			});
		}

  		return auth;
	}]);

angular.module('auth').
	factory('authInterceptor', ['$q', '$window', 'apiClient', function ($q, $window, apiClient) {
	  	
	  	/**
		 * @ngdoc service
		 * @name authInterceptor
		 *
		 * @description
		 * A request interceptor that adds the token to API requests.
		 */
	  	return {

		  	/**
	  		 * @ngdoc method
		     * @name authInterceptor#request
			 * 
			 * @description
			 * Once recieved, the token is saved in `localStorage`,
			 * and is added to every subsequent request to the API.
			 * This method retrieves the JWT token from `localStorage`,
			 * and adds it to the Authorization header of the request.
			 *
			 * @param {Object} config Request config object
			 *
			 * @returns
			 * {Object} Request config object
			 */
		    request: function (config) {
		    	config.headers = config.headers || {};
		    	delete config.headers["Authentication-Token"]

		    	if ( is_api_url(config.url) ) {
			    	var token = $window.localStorage.getItem('bhsclient_token');
					if ( token ) {
			        	config.headers["Authentication-Token"] = token;
			    	}
			    }
			    return config;
		    },

		    /**
	  		 * @ngdoc method
		     * @name authInterceptor#response
			 * 
			 * @description
			 * Removes JWT token from `localStorage` 
			 * if a response with status 401 is recieved from the API.
			 *
			 * @param {Object} response Response object
			 *
			 * @returns
			 * {Promise} Response promise
			 */
		    response: function (response) {
		      	if ( is_api_url(response.url) && response.status === 401) {
		        	$window.localStorage.removeItem('bhsclient_token');
		      	}
		      	return response || $q.when(response);
		    }
	  	};

	  	/**
	  	 * @ngdoc function
	  	 * @name is_api_url
	  	 * @module auth
	  	 * 
	  	 * @description
	  	 * Tests whether a string is an API url or not.
	  	 *
	  	 * @param {String} url Url to test
	  	 *
	  	 * @returns
	  	 * {boolean}
	  	 */
	  	function is_api_url(url) {
	  		var base_api_url = apiClient.base_url,
	    		base_api_url_regex = new RegExp(base_api_url, 'i');

	    	return base_api_url_regex.test(url);
	  	}
	}]);
