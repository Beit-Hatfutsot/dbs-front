'use strict';

angular.module('auth').

	factory('authManager', [
	'$modal', '$state', '$resource', 'apiClient', '$http', '$compile', '$rootScope', '$q', 
	function($modal, $state, $resource, apiClient, $http, $compile, $rootScope, $q) {
		var authClient, auth_manager;
		//$http.defaults.withCredentials = true;

		authClient = $resource(apiClient.urls.auth, null, {
    		signin: { 
    			method: 'POST', 
    			withCredentials: true,
    		}
		});

	  	auth_manager = {

	  		in_progress: false,

	  		signedin_user: false,

	  		csrf_token: '',

	  		authenticate: function(next_state, config) {

	  			if ( !this.signed_in_user ) {
				    
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
		  		
		  		if (!this.in_progress && !this.signed_in_user) {

			  		var self = this;

			  		var sign_in_deferred = $q.defer();

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
				    		email: username, 
				    		password: password, 
				    		next: '/',
				    		submit: 'Login',
				    		csrf_token: csrf_token
				    	}).$promise.
				    	then(function(response) {
				    		if (response.meta.code == 200) {
					    		self.signedin_user = response.response.user;
					    		sign_in_deferred.resolve(response);
				    		} else {
				    			sign_in_deferred.reject()
				    		}
				    	}, function() {
				    		sign_in_deferred.reject();
				    	}).
				    	finally(function() {
	  						self.in_progress = false;
		  				});
			  		}, function() {
			  			self.in_progress = false;
			  			sign_in_deferred.reject();
			  		});

			  		return sign_in_deferred.promise;
		  		}
		  		else {
		  			return false;
		  		}
		  	},

		  	initiate_contact: function() {
		  		return $http.get(apiClient.urls.auth, {withCredentials: true});
		  	}
	  	};

  		return auth_manager;
	}]);
