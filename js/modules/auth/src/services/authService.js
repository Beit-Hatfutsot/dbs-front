/**
 * @ngdoc service
 * @name auth
 *
 * @description
 * A service to handle user signin, signout & registration.
 */

angular.module('auth').

	factory('auth', [
	'$modal', '$state', '$http', 'apiClient', '$q', '$window', '$rootScope', 'user',
	function($modal, $state, $http, apiClient, $q, $window, $rootScope, user) {
		var auth;

		auth = {
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
	  			var body = document.getElementsByTagName('body')[0];

	  			if ( !(this.is_signedin()) ) {
	  				body.addClassName('auth');
				    angular.element()
				    var authModalInstance = $modal.open({
				     	templateUrl: 'templates/auth/auth_modal.html',
				     	controller: 'AuthCtrl as authController',
				     	size: 'lg',
				     	modalClass: 'auth-modal',
				     	resolve: {
				     		isRegister: function() {
				     			return config.register;
				     		}
				     	}
				    });

				    authModalInstance.result.then(function(user_data) {
				    	if (config.next_state) {
				    		$state.go(config.next_state);
				    	}
				    }, function(dismiss_reason) {
				    	if (config.fallback_state) {
				    		$state.go(config.fallback_state, config.fallback_state_params);
				    	}
				    }).
				    finally(function() {
				    	body.removeClassName('auth');
				    });
				}
		  	},

		  	/**
	  		 * @ngdoc method
		     * @name auth#signin
		     * 
		     * @param email {String} user email
		     * @param password {String} user password
			 * 
			 * @description
			 * Sign a user in:
			 * Sends a request to the auth API endpoint with user credentials.
			 * Upon success, saves the authorization token on localStorage, and gets user data from {@link user}.
			 *
			 * @returns
			 * {Promise}
			 */
		  	signin: function(email, password) {
		  		if ( !this.in_progress ) {
		  			this.in_progress = true;

		  			this.signout();

			  		var self = this,
					 	signin_deferred = $q.defer();

					try {
				  		$http.post(apiClient.urls.auth, {
				    		username: email,
				    		password: password
				    	}).
				    	success(function(response) {
				    		if (response.token) {
				    			$window.localStorage.setItem('bhsclient_token', response.token);
				    			user.$get().then(function() {
				    				$rootScope.$broadcast('signin');
					    			signin_deferred.resolve();
				    			});
				    		} else {
				    			signin_deferred.reject();
				    		}
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

		  	/**
	  		 * @ngdoc method
		     * @name auth#register
		     * 
		     * @param name {String} user name
		     * @param email {String} user email
		     * @param password {String} user password
			 * 
			 * @description
			 * Registers a new user:
			 * Sends a POST request to the user API endpoint with user credentials.
			 * Upon success, signs the user in.
			 *
			 * @returns
			 * {Promise}
			 */
		  	register: function(name, email, password) {
		  		if (!this.in_progress) {
		  			this.in_progress = true;
		  			this.signout();

		  			var self = this,
					 	register_deferred = $q.defer();

					try {
				  		$http.post(apiClient.urls.user, {
				  			name: name,
				    		email: email,
				    		password: password
				    	}).
				    	success(function(response) {
				    		self.in_progress = false;
				    		self.signin(email, password).then(function() {
				    			register_deferred.resolve();
				    		},
				    		function() {
				    			register_deferred.reject();
				    		});
				    	}).
				    	error(function() {
				    		self.in_progress = false;
				    		register_deferred.reject();
				    	});
				    }
				    catch(e) {
				    	register_deferred.reject();
				    }

	  				return register_deferred.promise;
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
		  		if ( $window.localStorage.getItem('bhsclient_token') && user.email ) {
		  			return true;
		  		}
		  		else {
		  			return false;
		  		}
		  	},

		  	get_token: function() {
		  		return this.is_signedin() ? $window.localStorage.getItem('bhsclient_token') : false;
		  	}
	  	};

  		return auth;
	}]);

angular.module('auth').
	factory('authInterceptor', ['$q', '$window', 'apiClient', function ($q, $window, apiClient) {
	  	return {
		    request: function (config) {
		    	var base_url = apiClient.base_url;
		    	var base_url_regex = new RegExp(base_url, 'i');

		    	config.headers = config.headers || {};
		    	delete config.headers.Authorization;

		    	if ( base_url_regex.test(config.url) ) {
			    	if ( $window.localStorage.getItem('bhsclient_token') ) {
			        	config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('bhsclient_token');
			    	}
			    }

			    return config;
		    },
		    response: function (response) {
		      	if (response.status === 401) {
		        	$window.localStorage.removeItem('bhsclient_token');
		      	}
		      	return response || $q.when(response);
		    }
	  	};
}]);
