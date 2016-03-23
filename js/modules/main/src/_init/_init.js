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
    'plumb',
    'rcSubmit',
    'gedcomParser',
	'hc.marked'
    ]).
config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	   '$httpProvider', '$provide', '$sceDelegateProvider', 'markedProvider',

function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $provide, $sceDelegateProvider, markedProvider) {

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
            name: 'item-view',
            url: '/{collection: (?:place|image|personality|familyname|video)}/{local_slug}',
            controller: 'ItemCtrl as itemController',
            onExit: slug_cleaner,
			templateUrl: function(params) {
				// TODO: rinse - this code was copied from itemService.js
				var slug_collection_map = {
					  "image": "photoUnits",
					  "personality": "personalities",
					  "place": "places",
					  "familyname": "familyNames",
					  "video": "movies"};

				return 'templates/item/'+slug_collection_map[params.collection]+'.html';
			}
        },

        {
            name: 'general-search',
            url: '/search?q&size&from_&collection',
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
            url: '/חפשו?q&size&from_&collection',
            controller: 'GeneralSearchController as generalSearchCtrl',
            templateUrl: 'templates/main/search-results.html'
        },

		/*
        {
            name: 'mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            onEnter: ['notification', 'plumbConnectionManager', 'plumbConnectionSetManager', function(notification, plumbConnectionManager, plumbConnectionSetManager) {
                notification.clear();
                plumbConnectionManager.connections = {};
                angular.forEach(plumbConnectionSetManager.sets, function(connection_set) {
                    connection_set.repaint();
                });
            }]
        }, 
		*/
        {
            name: 'ftrees',
            url: '/ftrees?place&first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&filters_tree_number',
            controller: 'FtreesController as ftreesCtrl',
            templateUrl: 'templates/main/ftrees/ftrees.html'
        },
        {
            name: 'he.he_ftrees',
            url: '/עצימשפחה?place&first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&filters_tree_number',
            controller: 'FtreesController as ftreesCtrl',
            templateUrl: 'templates/main/ftrees/ftrees.html'
        },
		/*
        {
            name: 'ftree-view',
            url: '/ftree_view/:tree_number/:node_id',
            controller: 'FtreeViewController as ctrl',
            templateUrl: 'templates/main/ftrees/ftree-item.html',
            onEnter: ['header', function(header) {
                header.show_recent();
				header.hide_main = true;
            }],
            onExit: ['header', function(header) {
				header.hide_main = false;
            }]
        },


        {
            name: 'upload',
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
        },

        {
            name: 'verify_email',
            url: '/verify_email/:verification_token',
            controller: 'VerifyEmailController as verifyEmailCtrl',
            templateUrl: 'templates/main/verify_email.html'
        },
		*/

        {
            name: '404',
            abstract: true,
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
    $provide.decorator('$state', function($delegate, $stateParams) {
        var old_go = $delegate.go;
        $delegate.go = function(state_name, state_params, config) {
			var target = state_name;
			
			if ($delegate.lastState)
				var lastStateHe = $delegate.lastState.name.indexOf('he') === 0,
				    targetHe = target.indexOf('he') === 0;
				if (lastStateHe && !targetHe)
					target = 'he.he_' + target;
            $delegate.lastState = $delegate.current;
            $delegate.lastStateParams = $delegate.params;
            return old_go.apply($delegate, [target, state_params, config]);
        };
        return $delegate;
    });

    $urlRouterProvider.otherwise('/405');

    $locationProvider.html5Mode(true);

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        new RegExp('^http[s]?:\/\/storage.googleapis.com\/bhs.*\.mp4$')
    ]);

	markedProvider.setOptions({ breaks: true })
}]).
run(['$state', '$rootScope', 'langManager', 'header', function ($state, $rootScope, langManager, header) {
    
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
    
    // $rootScope.facebookAppId = 666465286777871;

    $state.go('start');
	$rootScope.$on('$stateChangeSuccess',
		function(event, toState, toParams, fromState, fromParams){
			$rootScope.title = ('title' in toState)?toState.title:"";
	});

}]);
