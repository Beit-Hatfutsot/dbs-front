'use strict';

/**
 * @ngdoc module
 * @name main
 * @module main
 *
 * @description
 * # BHSClient main module
 * This is the main module for the BHS client.
 * It contains the ui.router state configurations.
 */
angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'ui.bootstrap',
    'ui.router',
    'config',
    'flow',
    'lang',
    'auth',
    'apiClient',
    'cache',
    'social',
    'rcSubmit',
    'gedcomParser',
	'hc.marked',
    'ui.gravatar',
    'bhsclient-templates',
    'duScroll',
    'angulartics',
    'angulartics.google.analytics'
    ]).
config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	   '$httpProvider', '$provide', '$sceDelegateProvider', 'markedProvider', 'gravatarServiceProvider', '$analyticsProvider',

function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $provide, $sceDelegateProvider, markedProvider, gravatarServiceProvider, $analyticsProvider) {

    $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
    $analyticsProvider.withAutoBase(true);  /* Records full path */
    $analyticsProvider.virtualPageviews(false);


    var dataLayer = window.dataLayer = window.dataLayer || [];
		// to be used we exiting the item pages
	var slug_cleaner = ['$rootScope', function($rootScope) {
		$rootScope.slug = null;
	}],
		// all of the states
		//TODO: rinse, we should have one item-view state for all languages
        states = [
        {
            name: 'he',
			abstract: true,
			template: "<div ui-view></div>",
            url: '/he',
            onEnter: ['langManager', function(langManager) {
                langManager.lang = 'he';
            }]
        },

        {
            name: 'start',
			title: 'Home Page',
            url: '/',
            templateUrl: 'templates/main/start.html',
            controller: 'StartController as startCtrl',
            onEnter: ['cache', 'wizard', 'header', function(cache, wizard, header) {
                wizard.clear();
                header.sub_header_state = 'closed';
            }]
        },
		{
			name: 'personality-redirect',
			url: '/personality/{local_slug}',
            onEnter: ['$state', '$stateParams', function($state, $stateParams) {
				$state.go('item-view', {collection: 'luminary',
							     		local_slug: $stateParams.local_slug})
			}]

		},


        {
            name: 'item-view',
            url: '/{collection: (?:place|image|luminary|familyname|video)}/{local_slug}',
            controller: 'ItemCtrl as itemController',
            onExit: slug_cleaner,
			templateUrl: function(params) {
				// TODO: rinse - this code was copied from itemService.js
				var slug_collection_map = {
					  "image": "photoUnits",
					  "luminary": "personalities",
					  "place": "places",
					  "familyname": "familyNames",
					  "video": "movies"};

				return 'templates/item/'+slug_collection_map[params.collection]+'.html';
			}
        },

        {
            name: 'general-search',
            url: '/search?q&size&from_&collection'+
                        '&first&first_t&last&last_t'+
                        '&place&pob&pom&pod&place_t&pob_t&pom_t&pod_t'+
                        '&yob&yom&yod&yob_t&yom_t&yod_t&yob_v&yom_v&yod_v'+
                        '&sex&treenum&more',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/search-results.html'
        },

        {
            name: 'about_center',
            url: '/about/:collection',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/allresults.html'
        },

        {
            name: 'he.he_about_center',
            url: '/אודות/:collection',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/allresults.html'
        },

        {
            name: 'he.he_start',
			title: 'עמוד הבית',
            url: '/',
            templateUrl: 'templates/main/start.html',
            controller: 'StartController as startCtrl',
            onEnter: ['cache', 'wizard', 'header', function(cache, wizard, header) {
                wizard.clear();
                header.sub_header_state = 'closed';
            }]
        },
        {
            name: 'he.he_item-view',
            url: '/{local_slug}/{collection: (?:מקום|תמונה|אישיות|שםמשפחה|וידאו)}',
            controller: 'ItemCtrl as itemController',
            onExit: slug_cleaner,
			templateUrl: function(params) {
				// TODO: rinse - this code was copied from itemService.js
				var slug_collection_map = {
					  "תמונה": "photoUnits",
					  "אישיות": "personalities",
					  "מקום": "places",
					  "שםמשפחה": "familyNames",
					  "וידאו": "movies"};

				return 'templates/item/'+slug_collection_map[params.collection]+'.html';
			}

        },

        {
            name: 'he.he_general-search',
            url: '/חפשו?q&size&from_&collection'+
                        '&first&first_t&last&last_t'+
                        '&place&pob&pom&pod&place_t&pob_t&pom_t&pod_t'+
                        '&yob&yom&yod&yob_t&yom_t&yod_t&yob_v&yom_v&yod_v'+
                        '&sex&treenum&more',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/search-results.html'
        },


        {
            name: 'story',
            url: '/story/{user_id}',
            templateUrl: 'templates/main/story.html',
        },

        {
            name: 'he.he_story',
            url: '/story/{user_id}',
            templateUrl: 'templates/main/story.html',
        },

        {
            name: 'mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            /*onEnter: ['notification', function(notification) {
                notification.clear();
            }]*/
        },

         {
            name: 'he.he_mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            /*onEnter: ['notification', function(notification) {
                notification.clear();
            }]*/
        },

        /*{
            name: 'persons',
            url: '/person?first_name&last_name&sex&place&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&tree_number&more',
            controller: 'PersonsController as ctrl',
            templateUrl: 'templates/main/ftrees/persons.html'
        },
        {
            name: 'he.he_persons',
            url: '/person?first_name&last_name&sex&place&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&tree_number&more',
            controller: 'PersonsController as ctrl',
            templateUrl: 'templates/main/ftrees/persons.html'
        },*/

        {
            name: 'person-view-redirect',
            url: '/person/:tree_number/:node_id',
            onEnter: ['$state', '$stateParams', 'langManager', function($state, $stateParams, langManager) {
                $state.go(langManager.lang == 'he'?'he.he_person-view':'person-view',
                               {tree_number: $stateParams.tree_number, version: 0, node_id: $stateParams.node_id});
            }]

        },

        {
            name: 'person-view',
			// TODO: make the version optional
			url: '/person/:tree_number/:version/:node_id',
            controller: 'PersonViewController as ctrl',
            templateUrl: 'templates/main/ftrees/person.html',
            onEnter: ['header', function(header) {
                header.show_recent();
            }]
        },
        {
            name: 'he.he_person-view',
            url: '/person/:tree_number/:version/:node_id',
            controller: 'PersonViewController as ctrl',
            templateUrl: 'templates/main/ftrees/person.html',
            onEnter: ['header', function(header) {
                header.show_recent();
            }]
        },
        {
            name: 'login',
            url: '/login/:token',
            controller: 'LoginCtrl as ctrl',
            templateUrl: 'templates/main/start.html',
            onEnter: ['cache', 'wizard', 'header', function(cache, wizard, header) {
                wizard.clear();
                header.sub_header_state = 'closed';
            }]
        },



        /*{
            name: 'upload',
            abstract: true,
            url: '/upload',
            templateUrl: 'templates/main/upload/upload.html'
        },

        {
            name: 'he.he_upload',
            abstract: true,
            url: '/upload',
            templateUrl: 'templates/main/upload/upload.html'
        },

        {
            name: 'upload.image',
            url: '/image',
            controller: 'UploadFormController as uploadFormCtrl',
            templateUrl: 'templates/main/upload/image.html'
        },

        {
            name: 'he.he_upload.image',
            url: '/image',
            controller: 'UploadFormController as uploadFormCtrl',
            templateUrl: 'templates/main/upload/image.html'
        },

        {
            name: 'upload.video',
            url: '/video',
            //controller: 'PictureUploadController as pictureUploadCtrl',
            templateUrl: 'templates/main/upload/video.html'
        },

        {
            name: 'upload.music',
            url: '/music',
            //controller: 'PictureUploadController as pictureUploadCtrl',
            templateUrl: 'templates/main/upload/music.html'
        },

        {
            name: 'upload.family_tree',
            url: '/family_tree',
            controller: 'UploadFormController as uploadFormCtrl',
            templateUrl: 'templates/main/upload/tree.html'
        },*/


        {
            name: 'verify_email',
            url: '/verify_email/:verification_token',
            controller: 'VerifyEmailController as verifyEmailCtrl',
            templateUrl: 'templates/main/verify_email.html'
        },

        {
            name: '404',
            templateUrl: 'templates/main/404.html'
        }

    ];

    angular.forEach(states, function(state) {
		var he_state = angular.copy(state);
		// state.resolve = {currentLang: function () { return 'En'; }};
		// state.name = 'En_'+state.name;
        $stateProvider.state(state);
		/*
		he_state.url = '/he'+state.url;
		he_state.name = 'He_'+state.name;
		he_state.resolve = {currentLang: function () { return 'He'; }};
        $stateProvider.state(he_state);
		*/
    });

    /*** End of state definitions ***/

    // Add current state data to $state when calling $state.go
    $provide.decorator('$state', ['$delegate', '$stateParams', '$rootScope',
					   function($delegate, $stateParams, $rootScope) {
        var old_go = $delegate.go;
        $delegate.go = function(state_name, state_params, config) {
			var target = state_name;
            if ($delegate.lastState) {
                var lastStateHe = $delegate.current.name.indexOf('he') === 0,
                    targetHe = target.indexOf('he') === 0;
                if (lastStateHe && !targetHe) {
                    target = 'he.he_' + target;
                }
            }
            $delegate.lastState = $delegate.current;
            $delegate.lastStateParams = $delegate.params;

            return old_go.apply($delegate, [target, state_params, config]);
        };
        return $delegate;
    }]);

    $urlRouterProvider.otherwise(function($injector, $location){
       var state = $injector.get('$state');
       state.go('404');
       return $location.path();
	});

    $locationProvider.html5Mode(true);

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        new RegExp('^http[s]?:\/\/storage.googleapis.com\/bhs.*\.mp4$')
    ]);

	markedProvider.setOptions({ breaks: true })
}]).
run(['$state', '$rootScope', 'langManager', 'header', '$window', '$location', 'notification', function ($state, $rootScope, langManager, header, $window, $location, notification) {

    Object.defineProperty($rootScope, 'lang', {
        get: function() {
            return langManager.lang;
        },

        set: function(language) {
            langManager.lang = language;
        }
    });

    Object.defineProperty($rootScope, 'header_visible', {
        get: function() {
            return header.is_visible;
        }
    });

    $rootScope.isCurrentState = function(state_name) {
        return ($state.includes(state_name) || $state.includes('he.he_'+state_name));
    };

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams,
												 fromState, fromParams) {
		notification.loading(false);
		$rootScope.title = undefined;
		$rootScope.og_image = undefined;
		$rootScope.description = undefined;
		$rootScope.og_type = 'website';
		$rootScope.canonical_url = $state.href(toState,toParams,
											   {absolute: true});

	});
    var dataLayer = window.dataLayer = window.dataLayer || [];
	$rootScope.$on('$stateChangeSuccess', function() {
		dataLayer.push({
            event: 'ngRouteChange',
            attributes: {
                route: $location.url()
            }
        });
	});

}]);
