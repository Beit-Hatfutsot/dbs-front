'use strict';

angular.module('auth').

	factory('authManager', function($modal, $state, $resource, apiClient, $http, $compile, $rootScope, $q) {

		//$http.defaults.withCredentials = true;

		var authClient = $resource(apiClient.urls.auth, null, {
    		signin: { 
    			method: 'POST', 
    			headers: {
    				//'Content-Type': 'application/x-www-form-urlencoded',
    			}, 
    			withCredentials: true,
    			/*
    			transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
    			}*/
    		}
		});

	  	var auth_manager = {

	  		in_process: false,

	  		signed_in_user: false,

	  		csrf_token: '',

	  		authenticate: function(next_state, mandatory) {

	  			if ( !this.signed_in_user ) {
				    
				    var authModalInstance = $modal.open({
				      templateUrl: 'templates/auth/auth_modal.html',
				      controller: 'AuthCtrl as authController',
				      sise: 'lg'
				    });

				    authModalInstance.result.then(function(user_data) {
				    	$state.go(next_state);
				    }, function(dismiss_reason) {
				    	if (mandatory) {
				    		console.log(dismiss_reason);
				    	}
				    	else {
				    		$state.go(next_state);
				    	}
				    });
				} 
				else {
					$state.go(next_state);
				} 
		  	},

		  	openRegistrationModal: function(next_state, mandatory) {
		  		
		  		var authModalInstance = $modal.open({
			      templateUrl: 'templates/auth/authmodal.html',
			      controller: 'AuthCtrl as authController',
			      sise: 'lg'
			    });

			    authModalInstance.result.then(function(user_data) {
			    	$state.go(next_state);
			    }, function(dismiss_reason) {
			    	if (mandatory) {
			    		console.log(dismiss_reason);
			    	}
			    	else {
			    		$state.go(next_state);
			    	}
			    });
		  	},

		  	signin: function(username, password) {
		  		
		  		if (!this.in_process && !this.signed_in_user) {

			  		var self = this;

			  		var sign_in_deferred = $q.defer();

			  		this.in_process = true;

			  		this.initiate_contact().then(function(response) {

			  			//  here is a hack to get the csrf token
			  			var e = $compile(response.data)($rootScope.$new());
			  			var key = Object.keys(e).filter(function(key) {
			  				return e[key].tagName == 'FORM' || e[key].tagName == 'form'
			  			})[0];
			  			var csrf_token = e[key].querySelector('#csrf_token').value;
			  			
			  			authClient.signin({
				    		email: username, 
				    		password: password, 
				    		next: '/',
				    		submit: 'Login',
				    		csrf_token: csrf_token
				    	}).$promise.
				    	then(function(response) {
				    		self.signed_in_user = response.response.user;
				    		self.in_process = false;
				    		sign_in_deferred.resolve(response);
				    	}, function() {
				    		self.in_process = false;
				    		sign_in_deferred.reject();
				    	});
						
						/*
						$http.post(apiClient.urls.auth, {
							email: username, 
				    		password: password, 
				    		next: '/',
				    		submit: 'Login',
				    		csrf_token: csrf_token
						}).success(function() {

						})
						*/
			  		}, function() {
			  			self.in_process = false;
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
	});
