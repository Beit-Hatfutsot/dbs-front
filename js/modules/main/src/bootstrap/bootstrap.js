'use strict';

angular.module('main', [
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'header',
    'wizard',
    'wizardResult',
    'search',
    'apiClient',
    'cache',
    'item'
]).
config([
'$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider',
function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {

    var states = [ 
        {
            name: 'start',
            url: '/',
            templateUrl: 'templates/start/start.html',
            controller: 'WizardCtrl as wizardController'
        },

        {
            name: '404',
            url: '/404',
            templateUrl: 'templates/404.html'
        },

        {
            name: 'wizard-result',
            parent: 'start',
            url: 'wizard-result?place&name',
            templateUrl: 'templates/wizard-result/wizard-result.html',
            controller: 'WizardResultCtrl as wizardResultController'
        },
        
        {
            name: 'item-view',
            url: '/item/:id',
            templateUrl: 'templates/item/item.html',
            controller: 'ItemCtrl as itemController',
            resolve: {

                itemData: ['$stateParams', 'item', function($stateParams, item) {
                    return item.get($stateParams.id);
                }]
            }
        }
    ];

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);
}]).
run(['$state', 'authManager', function ($state, authManager) {
    $state.go('start');
}]);
