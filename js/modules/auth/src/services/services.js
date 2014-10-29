angular.module('auth').

	factory('authManager', [
	'$modal', '$state', '$resource', 'apiClient', '$http', '$compile', '$rootScope', '$q', 
	function($modal, $state, $resource, apiClient, $http, $compile, $rootScope, $q) {
		var authClient, auth_manager;
		//$http.defaults.withCredentials = true;

		authClient = $resource(apiClient.urls.auth, null, {
    		signin: { 
    			method: 'POST', 
    			//withCredentials: true,
    		}
		});

	  	auth_manager = {

	  		in_progress: false,

	  		signedin_user: false,

	  		csrf_token: '',

	  		authenticate: function(next_state, config) {

	  			if ( !this.signedin_user ) {
				    
				    var authModalInstance = $modal.open({
				     	templateUrl: 'templates/auth/auth_modal.html',
				     	controller: 'AuthCtrl as authController',
				     	size: 'lg'
				    });

				    authModalInstance.result.then(function(user_data) {
				    	$state.go(next_state);
				    }, function(dismiss_reason) {
				    	if (config.mandatory === false) {
				    		$state.go(next_state);
				    	}
				    });
				} 
				else {
					$state.go(next_state);
				} 
		  	},

		  	signin: function(username, password) {
		  		var self = this;

		  		if (!this.in_progress && !this.signed_in_user) {

			  		var signin_deferred = $q.defer(); 

			  		authClient.signin({
			    		username: username, 
			    		password: password 
			    	}).$promise.
			    	then(function(response) {
			    		if (response.token) {
			    			sessionStorage.bhsclient_token = response.token;
				    		self.signedin_user = username;
				    		signin_deferred.resolve();
			    		} else {
			    			signin_deferred.reject()
			    		}
			    	}, function() {
			    		signin_deferred.reject();
			    	}).
			    	finally(function() {
							self.in_progress = false;
	  				});

	  				return signin_deferred.promise;
	  			}
	  			else {
	  				return false;
	  			}
				/*		  		
		  		if (!this.in_progress && !this.signed_in_user) {

			  		var self = this;

			  		var signin_deferred = $q.defer();

			  		this.in_progress = true;

			  		this.initiate_contact().then(function(response) {

			  			//  here is a hack to get the csrf token
			  			var e = $compile(response.data)($rootScope.$new());
			  			var key = Object.keys(e).filter(function(key) {
			  				return e[key].tagName == 'FORM' || e[key].tagName == 'form'
			  			})[0];

			  			if ( e[key] !== undefined ) {
			  				var csrf_token = e[key].querySelector('#csrf_token').value;
			  			}
			  			
			  			authClient.signin({
				    		username: username, 
				    		password: password, 
				    		//next: '/',
				    		//submit: 'Login',
				    		//csrf_token: csrf_token
				    	}).$promise.
				    	then(function(response) {
				    		if (response.meta.code == 200) {
					    		self.signedin_user = response.response.user;
					    		signin_deferred.resolve();
				    		} else {
				    			signin_deferred.reject()
				    		}
				    	}, function() {
				    		sign_in_deferred.reject();
				    	}).
				    	finally(function() {
	  						self.in_progress = false;
		  				});
			  		}, function() {
			  			self.in_progress = false;
			  			signin_deferred.reject();
			  		});

			  		return signin_deferred.promise;
		  		}
		  		else {
		  			return false;
		  		}
		  		*/
		  	},

		  	initiate_contact: function() {
		  		return $http.get(apiClient.urls.auth, {withCredentials: true});
		  	}
	  	};

  		return auth_manager;
	}]);

angular.module('auth').
	factory('authInterceptor', ['$rootScope', '$q', '$window', function ($rootScope, $q, $window) {
	  	return {
		    request: function (config) {
		      config.headers = config.headers || {};
		      if ($window.sessionStorage.bhsclient_token) {
		        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.bhsclient_token;
		      }
		      return config;
		    },
		    response: function (response) {
		      if (response.status === 401) {
		        // handle the case where the user is not authenticated
		      }
		      return response || $q.when(response);
		    }
	  	};
}]);
