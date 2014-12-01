'use strict';

angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'apiClient',
    'cache'
]).
config([
'$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider',
function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {

    var states = [ 
        {
            name: 'start',
            url: '/',
            templateUrl: 'templates/main/start.html',
            onEnter: ['cache', 'wizard', function(cache, wizard) {
                cache.clear();
                wizard.clear();
            }]
        },

        {
            name: '404',
            url: '/404',
            templateUrl: 'templates/main/404.html'
        },

        {
            name: 'wizard-result',
            url: '/wizard-result?place&name',
            templateUrl: 'templates/main/wizard-result.html',
            controller: 'WizardResultCtrl as wizardResultController'
        },
        
        {
            name: 'item-view',
            url: '/item/:id',
            templateUrl: 'templates/main/item.html',
            controller: 'ItemCtrl as itemController'
        }
    ];

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
}]).
run(['$state', function ($state) {
    $state.go('start');
}]);
;if (Object.prototype.isEmpty === undefined) {

    Object.prototype.isEmpty = function() {
        if (Object.keys(this).length === 0) {
            return true;
        }

        return false;
    }
}

if (Object.prototype.isNotEmpty === undefined) {

    Object.prototype.isNotEmpty = function() {
        if (Object.keys(this).length === 0) {
            return false;
        }

        return true;
    }
}

if (Array.prototype.isEmpty === undefined) {

    Array.prototype.isEmpty = function() {
        if (this.length === 0) {
            return true;
        }

        return false;
    }
}

if (Array.prototype.isNotEmpty === undefined) {

    Array.prototype.isNotEmpty = function() {
        if (this.length === 0) {
            return false;
        }

        return true;
    }
}
;var HeaderCtrl = function(notification) {

	this.search_placeholders = {
		'en': 'Search for communities, last names and personalities',
		'he': 'חפשו קהילות, פירושי שמות משפחה ואישים'
	};

	 Object.defineProperty(this, 'notification_message', {
        get: function() {
        	return notification.get();
        }
    });
};

HeaderCtrl.prototype = {

};

angular.module('main').controller('HeaderCtrl', ['notification', HeaderCtrl]);
;var ItemCtrl = function($stateParams, item, notification, itemTypeMap) {
	var self = this;

	this.in_progress = true;
	this.content_loaded = false;
	this.failed = false;
	
	notification.clear();

	Object.defineProperty(this, 'item_type', {
		get: function() {
			return itemTypeMap.get_type(this.item_data.UnitType)
		}
	})

	notification.put({
		en: 'Fetching item...',
		he: 'טוען פריט...'
	});
	item.get($stateParams.id).
		then(function(item_data) {
			self.item_data = item_data;
			self.content_loaded = true;
			notification.put({
				en: 'Item loaded successfuly.',
				he: 'הפריט נטען בהצלחה.' 
			});
		}, function() {
			self.failed = true;
			notification.put({
				en: 'Failed to fetch item.',
				he: 'טעינת פריט נכשלה.'
			});
		}).
		finally(function() {
			self.in_progress = false;
		});
};

ItemCtrl.prototype = {

};

angular.module('main').controller('ItemCtrl', ['$stateParams', 'item', 'notification', 'itemTypeMap', ItemCtrl]);
;var ItemPreviewCtrl = function($state, $scope, itemTypeMap) {
    this.$state = $state;

    $scope.item_type = itemTypeMap.get_type($scope.preview_data.UnitType);
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
        this.$state.go('item-view', {id: item_data._id.$oid});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', ItemPreviewCtrl]);;var MainCtrl = function($state, langManager, wizard, authManager) {
    var self = this;

    this.$state = $state;
    this.langManager = langManager;
    this.search_again_visible = false;
    this.placeholders = { 
        name: {
            en: 'Surname',
            he: 'שם משפחה'
        },
        place: {
            en: 'Place of Origin',
            he: 'מקום'
        }
    },
    this.wizard_query = {
        name: '',
        place: ''
    };

    Object.defineProperty(this, 'wizard_suggestions', {
        get: function() {
            return wizard.result.suggestions;
        }
    });

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	},

    	set: function(language) {
    		langManager.lang = language;
            window.localStorage.language= language;
    	}
    });

    Object.defineProperty(this, 'show_notifications', {
        get: function() {
            if ( $state.includes('start') ) {
                return false;
            }

            return true;
        }
    });

    Object.defineProperty(this, 'signed_in_user', {
        get: function() {
            return authManager.signed_in_user;
        }
    });

    Object.defineProperty(this, 'name_placeholder', {

        get: function() {
            return this.placeholders.name[langManager.lang];
        }
    });

    Object.defineProperty(this, 'place_placeholder', {

        get: function() {
            return this.placeholders.place[langManager.lang];
        }
    });

    Object.defineProperty(this, 'submit_disabled', {

        get: function() {
            if (this.wizard_query.name == '' && this.wizard_query.place == '') {
                return true;
            }
            else {
                return false;
            }
        }
    });
}

MainCtrl.prototype = {

    start: function() {
        this.search_again_visible = true;
        this.$state.go('wizard-result', {name: this.wizard_query.name, place: this.wizard_query.place});
    },

    start_name: function(name) {
        var lang_index = this.langManager.lang[0].toUpperCase() + this.langManager.lang[1];
        this.wizard_query.name = name.Header[lang_index];
        this.start();
    },

    start_place: function(place) {
        var lang_index = this.langManager.lang[0].toUpperCase() + this.langManager.lang[1];
        this.wizard_query.place = place.Header[lang_index];
        this.start();
    }
}

angular.module('main').controller('MainCtrl', ['$state', 'langManager', 'wizard', 'authManager', MainCtrl]);
;var WizardResultCtrl = function($scope, $stateParams, wizard, notification) {
	var self = this;

    this.in_progress = true;
    this.failed = false;
    this.search_status = 'none';
    this.suggestion_status = 'none';
    this.notification = notification;

    Object.defineProperty(this, 'result', {
        get: function() {
            return wizard.result;
        }
    });

    Object.defineProperty(this, 'last_search', {
        get: function() {
            return wizard.last_search;
        }
    });
	
    $scope.mainController.wizard_query.name = $stateParams.name;
    $scope.mainController.wizard_query.place = $stateParams.place;
    
    notification.put({
        en: 'Searching...',
        he: 'מחפש...'
    });
    
    wizard.search($stateParams.name, $stateParams.place)
		.then(function(result) {
            try {
                // set search status
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
                        en: 'We have not found a name and community to match your search.',
                        he: 'לא מצאנו את שם המשפחה והקהילה שחיפשתם.'
                    });
                }
                
                // set suggestions status
                if ( result.suggestions.name.isNotEmpty() || result.suggestions.place.isNotEmpty() ) {
                    
                    notification.add({
                        en: 'Try using our suggestions below, or search again.',
                        he: 'נסו להעזר בהצעות שלנו מטה, או חפשו שוב.'
                    });
                    
                    if ( result.suggestions.name.isNotEmpty() && result.suggestions.place.isEmpty() ) {
                        self.suggestion_status = 'name';
                    }
                    else if ( result.suggestions.name.isEmpty() && result.suggestions.place.isNotEmpty() ) {
                        self.suggestion_status = 'place';
                    }
                    else {
                        self.suggestion_status = 'both';
                    }
                }
                else {
                    self.suggestion_status = 'none';
                }    
            }
            catch(e) {
                self.fail();
            }    
		}, 
        function() {
            // handle case when connection to search service failed
            self.fail();
        }).
        finally(function() {
            self.in_progress = false;
        });
};

WizardResultCtrl.prototype = {
    
    fail: function() {
        this.failed = true;
        this.notification.put({
            en: 'Search has failed.',
            he: 'החיפוש נכשל.'
        });
    }
};

angular.module('main').controller('WizardResultCtrl', ['$scope', '$stateParams', 'wizard', 'notification', WizardResultCtrl]);
;angular.module('main').directive('animateDown', [function() {
	return {
		restrict: 'EA',
		scope: {
			trigger: '=when'
		},
		link: function(scope, element) {

			scope.$watch('trigger', function(newVal, oldVal) {
				var search_again_domelement = document.querySelector('#search-again');
				if (search_again_domelement) {
					var search_again_height = search_again_domelement.offsetHeight;
					
					element.css('-webkit-transition', 'all 0.7s ease');
					element.css('-moz-transition', 'all 0.7s ease');
					element.css('-o-transition', 'all 0.7s ease');
					element.css('-ms-transition', 'all 0.7s ease');
					element.css('transition', 'all 0.7s ease');
					
					if (newVal !== true) {	
						element.css('-webkit-transform', 'translate(0,0)');
						element.css('-moz-transform', 'translate(0,0)');
						element.css('-o-transform', 'translate(0,0)');
						element.css('-ms-transform', 'translate(0,0)');
						element.css('transform', 'translate(0,0)');
					}
					else {
						element.css('-webkit-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-moz-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-o-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('-ms-transform', 'translate(0, ' + search_again_height + 'px)');
						element.css('transform', 'translate(0, ' + search_again_height + 'px)');
					}
				}
			});
		}
	}
}]);
;angular.module('main').directive('fitThumb', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element) {
			
			$timeout(function() {
				var width = element[0].naturalWidth,
				height = element[0].naturalHeight,
				ratio;
				
				if (width !== undefined && height !== undefined) {
					ratio = height/width;
				
					if (ratio < 1) {
						element.css('height', '100%');
					}
					else {
						element.css('width', '100%');
					}
				}
			});
		}
	}
}]);;angular.module('main').directive('icon', ['langManager', function(langManager) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/icon.html',
		scope: {
			source: '@',
			altText: '=',
			position: '=',
			hoverOffset: '='
		},
		link: function(scope, element) {
			if (scope.source === undefined) {
				scope.default_source = 'images/icons.png';
			}

			Object.defineProperty(scope, 'lang_code', {
				get: function() {
					return langManager.lang;
				}
			});

			var image = element.find('img');
			
			image.css('left', scope.position[0] + 'px');
			image.css('top', scope.position[1] + 'px');
			
			if (scope.hoverOffset !== undefined) {
				image.bind('mouseenter', function() {
					image.css('left', scope.position[0] + scope.hoverOffset[0] + 'px');
					image.css('top', scope.position[1] + scope.hoverOffset[1] + 'px');
				});
				image.bind('mouseleave', function() {
					image.css('left', scope.position[0] + 'px');
					image.css('top', scope.position[1] + 'px');
				});
			}
		}
	}
}]);;angular.module('main').directive('itemPreview', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/item-preview.html',
		scope: {
			preview_data: '=previewData',
			arrow: '@'
		},
		controller: 'ItemPreviewCtrl as itemPreviewController'
	};
});


angular.module('main').directive('multipleResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/multiple-result.html',
		scope: {
			result_data: '=resultData'
		},
		controller: 'MultipleResultCtrl as multipleResultController',
		link: function(scope) {
			scope.multipleResultController.result_data = scope.result_data;
			scope.multipleResultController.content = scope.content;
		}
	};
});;angular.module('main').directive('itemScroll', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {

			scope.$watch('mainController.search_again_visible', function(newVal, oldVal) {
				if (newVal === true) {
					element[0].scrollTop = 0;
				}
			});

			element.bind('scroll', function() {
				if (element[0].scrollTop != 0 && scope.mainController.search_again_visible) {
					scope.$apply(function(scope) {
						scope.mainController.search_again_visible = false;
					});
				}
			});
		}
	}
});;angular.module('main').directive('noResult', ['$rootScope', function($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/main/no-result.html',
		link: function(scope, element, attributes) {
			scope.content_type = attributes['content'];
		}
	};
}]);;angular.module('main').
	factory('item', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		var item_service, itemClient;

		itemClient = $resource(apiClient.urls.item +'/:item_id');

		item_service = {
			
			get: function(item_id) {
				var self 		= this,
					deferred	= $q.defer(),
					cached		= cache.get(item_id); 
					
				if (cached.isNotEmpty()) {
					deferred.resolve(cached);
				} 
				else {
					itemClient.get({item_id: item_id}).
						$promise.
						then(function(response) {
							cache.put(response.item_data);
							deferred.resolve(response.item_data);
						},
						function() {
							deferred.reject();
						});
				}

				return deferred.promise;
			}
		};

		return item_service;
	}]);;angular.module('main').service('itemTypeMap', function() {
	var map = {
		1: 'photo',
    	5: 'place',
    	6: 'name'
	}

	this.get_type = function(description_code) {
		return map[description_code];
	}
});;angular.module('main').
	factory('notification', function(langManager) {
		var message = {
			en: '',
			he: ''
		}

		var notification = {
			put: function(new_message) {
				message = new_message;
			},

			add: function(new_message) {
				message.en += ' ' + new_message.en;
				message.he += ' ' + new_message.he;
			},

			clear: function() {
				message = {
					en: '',
					he: ''					
				};
			},

			get: function() {
				return message[langManager.lang];
			}
		};

		return notification;
	});;angular.module('main').
	factory('wizard', ['$resource', '$q', 'apiClient', 'cache', function($resource, $q, apiClient, cache) {
		
		var searchClient = $resource(apiClient.urls.wizard_search);

		var wizard = {
			result: {},
			
			last_search: {
				name: '',
				place: ''
			},
			
			clear: function() {
				this.result = {};
			},
			
			search: function(name, place) {
	  			var self = this, 
	  				search_promise,
	  				deferred = $q.defer();
	  			
	  			search_promise = searchClient.get({
					name: name || '',
					place: place || ''	
				}).$promise;
	  					
				search_promise
					.then(function(result) {
						self.result = result;
						self.last_search.name = name;
						self.last_search.place = place;
						angular.forEach(result.bingo, function(item) {
							cache.put(item)
						});
					
						deferred.resolve(result);
					},
					function() {
						deferred.reject();
					});

	  			return deferred.promise;
		  	}
		};

		return wizard;
	}]);;angular.module('lang', []);;angular.module('lang').
	directive('en', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			replace: true,
			
			scope: {},
		  		
		    template: "<span ng-transclude style=\"width: inherit; height: inherit;\" class=\"en\" ng-show=\"langManager.lang == 'en'\"></span>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]).

	directive('he', ['langManager', function(langManager) {
		return {
			restrict: 'E',

			transclude: true,

			replace: true,

			scope: {},
		  		
		    template: "<span ng-transclude style=\"width: inherit; height: inherit;\" class=\"he\" ng-show=\"langManager.lang == 'he'\"></span>",
		
		    link: function(scope) {
		    	scope.langManager = langManager;
		    }
		};
	}]);;angular.module('lang').

	factory('langManager', function() {

	  	var lang_manager = {

	  		lang: window.localStorage.language || 'en'

	  	};

  		return lang_manager;
	});
;angular.module('apiClient', []);;angular.module('apiClient').

	factory('apiClient', function() {
	
	  	return {

	  		urls: {
	  			auth: 			'http://127.0.0.1:5000/auth',
	  			wizard_search: 	'http://127.0.0.1:5001/search/wizard',
	  			item: 			'http://127.0.0.1:5001/item'
	  		}
	  	}
	});
;angular.module('auth', []).
	config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}]);;var AuthCtrl = function($modalInstance, langManager, authManager) {
    var self = this;

    this.$modalInstance = $modalInstance;
    this.authManager = authManager;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	}
    });

    // user name
    this.iare = '';

    // password
    this.ias = '';

    // auth message to display to the user
    this.message = '';
}

AuthCtrl.prototype = {

    signin: function() {
        var self = this;

    	this.authManager.signin(this.iare, this.ias).
            then(function() {    
                self.message = 'Sign in succeeded';
                self.$modalInstance.close();
            }, function() {
                self.message = 'Sign in failed';
            });
    },

    dismiss: function() {
        this.$modalInstance.dismiss();
    }
}

angular.module('auth').controller('AuthCtrl', ['$modalInstance', 'langManager', 'authManager', '$http', AuthCtrl]);

;angular.module('auth').directive('needAuth', ['$state', 'authManager', function($state, authManager) {
	return {
		restrict: 'A',
		scope: {
			nextState: '@',
			isMandatory: '@needAuth'
		},
		link: function(scope, element) {
			element.bind('click', function() {
				var nextState,
					isMandatory = JSON.parse(scope.isMandatory);
				
				if (scope.nextState === undefined) {
					nextState = $state.current.name;
				} else {
					nextState = scope.nextState;
				}

				authManager.authenticate(nextState, { mandatory: isMandatory });
			});
		}
	}
}]);;angular.module('auth').

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
	  			
	  			return false;
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
;angular.module('cache', []);;angular.module('cache').
	factory('cache', [function() {
		var cache, cached_items;

		if( window.sessionStorage !== undefined ) {
			cached_items = window.sessionStorage;
		}
		else {
			cached_items = {
				setItem: function(key, item) {
					this[key] = item;
				},

				getItem: function(key) {
					return this[key] || null;
				},

				clear: function() {
					for (key in this) {
						delete this[key];
					}
				}
			};
		}

		cache = {
			put: function(item) {
				if ( item._id !== undefined ) {
					return cached_items.setItem( item._id.$oid, JSON.stringify(item) );
				}
				return false;
			},

			get: function(item_id) {
				var cached_string = cached_items.getItem(item_id);
				return cached_string ? JSON.parse(cached_string) : {};
			},

			clear: function() {
				cached_items.clear();
			}
		};

		return cache;
	}]);