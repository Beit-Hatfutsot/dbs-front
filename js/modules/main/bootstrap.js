'use strict';

angular.module('main', [
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'wizard',
    'search',
    'apiClient'
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
            url: 'wizard-result/place=:place/name=:name',
            templateUrl: 'templates/wizard-result/wizard-result.html',
            controller: 'WizardResultCtrl as wizardResultController'
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
