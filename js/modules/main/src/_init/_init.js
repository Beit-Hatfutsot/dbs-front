'use strict';

angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'apiClient',
    'cache',
    'plumb'
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
            controller: 'ItemCtrl as itemController'
        },

        {
            name: 'mjs',
            url: '/mjs',
            templateUrl: 'templates/main/mjs/mjs.html',
            controller: 'MjsController as mjsCtrl',
            onEnter: ['notification', function(notification) {
                notification.clear();
            }]
        }, 

        {
            name: 'ftrees',
            url: '/ftrees?first_name&last_name&maiden_name&sex&birth_place&marriage_place&death_place&birth_year&marriage_year&death_year&ind_index',
            controller: 'FtreesController as ftreesCtrl',
            reloadOnSearch: false,
            templateUrl: 'templates/main/ftrees/ftrees.html'
        },       

        {
            name: 'gedcom',
            url: '/gedcom',
            templateUrl: 'templates/gedcom/gedcom.html'
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
