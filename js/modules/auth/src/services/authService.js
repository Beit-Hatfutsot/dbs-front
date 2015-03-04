angular.module('auth').

	factory('auth', [
	'$modal', '$state', '$http', 'apiClient', '$q', '$window', 'user',
	function($modal, $state, $http, apiClient, $q, $window, user) {
		var auth, in_progress;
		
		in_progress = false;

	  	auth = {

	  		authenticate: function(config) {

	  			if ( !(this.is_signedin()) ) {
				    
				    var authModalInstance = $modal.open({
				     	templateUrl: 'templates/auth/auth_modal.html',
				     	controller: 'AuthCtrl as authController',
				     	size: 'lg'
				    });

				    authModalInstance.result.then(function(user_data) {
				    	if (config.next_state) {
				    		$state.go(config.next_state);
				    	} else {
				    		$state.go($state.current, $state.params, {reload: true, notify:true, inherit:false});
				    	}
				    }, function(dismiss_reason) {
				    	if (config.fallback_state) {
				    		$state.go(config.fallback_state, config.fallback_state_params);
				    	}
				    });
				} 
				else {
					if ( !(config.mandatory) ) {
						if (config.next_state) {
							$state.go(config.next_state);
				    	} else {
				    		$state.go($state.current, $state.params, {reload: true});
				    	}
			    	}
				} 
		  	},

		  	signin: function(username, password) {
		  		if ( !in_progress ) {
		  			in_progress = true;

		  			this.signout();

			  		var self = this,
					 	signin_deferred = $q.defer(); 

					try {
				  		$http.post(apiClient.urls.auth, {
				    		username: username, 
				    		password: password 
				    	}).
				    	success(function(response) {
				    		if (response.token) {
				    			$window.localStorage.setItem('bhsclient_token', response.token);
				    			signin_deferred.resolve();
				    		} else {
				    			signin_deferred.reject();
				    		}
				    	}). 
				    	error(function() {
				    		signin_deferred.reject();
				    	}).
				    	finally(function() {
							in_progress = false;
		  				});
				    }
				    catch(e) {
				    	signin_deferred.reject();
				    }

	  				return signin_deferred.promise;
		  		}
		  	},

		  	signout: function() {
		  		$window.localStorage.removeItem('bhsclient_token');
		  	},

		  	is_signedin: function() {
		  		if ( $window.localStorage.getItem('bhsclient_token') ) {
		  			return true;
		  		}
		  		else {
		  			return false;
		  		}
		  	},

		  	get_token: function() {
		  		return $window.localStorage.getItem('bhsclient_token') || false;
		  	}
	  	};

  		return auth;
	}]);

angular.module('auth').
	factory('authInterceptor', ['$q', '$window', function ($q, $window) {
	  	return {
		    request: function (config) {
		    	config.headers = config.headers || {};
		    	delete config.headers.Authorization;

		    	if ( /bhsapi/.test(config.url) || /127.0.0.1/.test(config.url) ) {
			    	if ( $window.localStorage.getItem('bhsclient_token') ) {
			        	config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('bhsclient_token');
			    	}
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
