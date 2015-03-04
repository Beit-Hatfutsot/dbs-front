'use strict';

angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'flow',
    'lang',
    'auth',
    'apiClient',
    'cache',
    'plumb',
    'rcSubmit',
    'gedcomParser'
]).
config([
'$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', '$provide',
function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $provide) {

    var states = [ 
        {
            name: 'start',
            url: '/',
            templateUrl: 'templates/main/start.html',
            onEnter: ['cache', 'wizard', function(cache, wizard) {
                wizard.clear();
            }]
        },

        {
            name: 'start-result',
            parent: 'start',
            url: 'start-result?place&name',
            controller: 'WizardResultCtrl as wizardResultController',
            templateUrl: 'templates/main/wizard-result.html'
        },

        {
            name: 'wizard-result',
            url: '/wizard-result?place&name',
            template: '<wizard-result></wizard-result>',
            onEnter: ['$stateParams', 'wizard', function($stateParams, wizard) {
                wizard.search($stateParams.name, $stateParams.place);
            }]
        },
        
        {
            name: 'item-view',
            url: '/item/:item_string',
            templateUrl: 'templates/main/item/item.html',
            resolve: {
                previousState: [
                    "$state",
                    function ($state) {
                        var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ]
            },
            controller: 'ItemCtrl as itemController'
        },

        {
            name: 'mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            //controller: 'MjsController as mjsCtrl',
            onEnter: ['notification', 'plumbConnectionManager', 'plumbConnectionManager2', function(notification, plumbConnectionManager, plumbConnectionManager2) {
                notification.clear();
                plumbConnectionManager.connections = {};
                plumbConnectionManager2.reinstantiatePlumb();
            }]
        }, 

        {
            name: 'ftrees',
            url: '/ftrees?first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year',
            controller: 'FtreesController as ftreesCtrl',
            reloadOnSearch: false,
            templateUrl: 'templates/main/ftrees/ftrees.html'
        },

        {
            name: 'ftree-view',
            parent: 'ftrees',
            url: '/ftree_view?ind_index',
            controller: 'FtreeViewController as ftreeViewCtrl',
            templateUrl: 'templates/main/ftrees/ftree-view.html'
        },

        {
            name: 'ftree-view.ftree-item',
            url: '/ftree_item?individual_id&tree_number',
            controller: 'FtreeItemController as ftreeItemCtrl',
            templateUrl: 'templates/main/ftrees/ftree-item.html'
        },
        
        {
            name: 'ftree-item',
            url: '/ftree_item?individual_id&tree_number',
            controller: 'FtreeItemController as ftreeItemCtrl',
            templateUrl: 'templates/main/ftrees/ftree-item.html'
        },            

        {
            name: 'upload',
            abstract: true,
            url: '/upload',
            controller: 'UploadController as uploadCtrl',
            templateUrl: 'templates/main/upload/upload.html'
        },

        {
            name: 'upload.image',
            url: '/image',
            controller: 'UploadImageController as uploadImageCtrl',
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
            //controller: 'PictureUploadController as pictureUploadCtrl',
            templateUrl: 'templates/main/upload/tree.html'
        },

        {
            name: '404',
            url: '/404',
            templateUrl: 'templates/main/404.html'
        }
    ];

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    $provide.decorator('$state', function($delegate, $stateParams) {
        var old_go = $delegate.go;
        $delegate.go = function(state_name, state_params, config) {
            $delegate.lastState = $delegate.current;
            $delegate.lastStateParams = $delegate.params;
            return old_go.apply($delegate, [state_name, state_params, config]);
        };
        return $delegate;
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
}]).
run(['$state', '$rootScope', 'langManager', function ($state, $rootScope, langManager) {
    
    Object.defineProperty($rootScope, 'lang', {
        get: function() {
            return langManager.lang;
        },

        set: function(language) {
            langManager.lang = language;
        }
    });

    $rootScope.isCurrentState = function(state_name) {
        return $state.includes(state_name);
    };


    $state.go('start');
}]);
