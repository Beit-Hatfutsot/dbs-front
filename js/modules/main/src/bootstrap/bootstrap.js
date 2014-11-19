'use strict';

angular.module('main', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'header',
    'search',
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
            controller: 'WizardCtrl as wizardController'
        },

        {
            name: '404',
            url: '/404',
            templateUrl: 'templates/main/404.html'
        },

        {
            name: 'wizard-result',
            parent: 'start',
            url: 'wizard-result?place&name',
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
