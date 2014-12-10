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
            controller: 'StartCtrl as startController',
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
            url: '/item/:id',
            templateUrl: 'templates/main/item.html',
            controller: 'ItemCtrl as itemController'
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
run(['$state', '$rootScope', 'langManager', 'authManager', function ($state, $rootScope, langManager, authManager) {
    
    Object.defineProperty($rootScope, 'lang', {
        get: function() {
            return langManager.lang;
        },

        set: function(language) {
            langManager.lang = language;
        }
    });

    Object.defineProperty($rootScope, 'signed_in_user', {
        get: function() {
            return authManager.signed_in_user;
        }
    });

    $rootScope.isCurrentState = function(state_name) {
        return $state.includes(state_name);
    };


    $state.go('start');
}]);
