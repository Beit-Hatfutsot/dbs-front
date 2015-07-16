'use strict';

angular.module('main', [
    'ngResource',
    'ngAnimate',
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
    'gedcomParser'
]).
config([
'$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', '$provide', '$sceDelegateProvider',
function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $provide, $sceDelegateProvider) {

    var states = [ 
        {
            name: 'start',
            url: '/',
            templateUrl: 'templates/main/start.html',
            controller: 'StartController as startCtrl',
            onEnter: ['cache', 'wizard', 'header', function(cache, wizard, header) {
                wizard.clear();
                header.sub_header_state = 'closed';
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
            controller: 'ItemCtrl as itemController',
            templateUrl: 'templates/main/item/item.html'
        },

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

        {
            name: 'ftrees',
            url: '/ftrees?first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&filters_tree_number',
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
            templateUrl: 'templates/main/ftrees/ftree-item.html',
            resolve: {
                fromFtreeView: ['$state', function($state) {
                    return $state.lastState.name === 'ftree-view.ftree-item';
                }]
            },
        },
        
        {
            name: 'ftree-item',
            url: '/ftree_item?individual_id&tree_number',
            controller: 'FtreeItemController as ftreeItemCtrl',
            templateUrl: 'templates/main/ftrees/ftree-item.html',
            resolve: {
                fromFtreeView: ['$state', function($state) {
                    return $state.lastState.name === 'ftree-view.ftree-item';
                }]
            },
            onEnter: ['header', 'fromFtreeView', function(header, fromFtreeView) {
                if (fromFtreeView) {
                    header.is_visible = false;
                }
            }],
            onExit: ['header', function(header) {    
                header.is_visible = true;
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

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        new RegExp('^http[s]?:\/\/storage.googleapis.com\/bhs.*\.mp4$')
    ]);
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
        return $state.includes(state_name);
    };


    $state.go('start');
}]);
