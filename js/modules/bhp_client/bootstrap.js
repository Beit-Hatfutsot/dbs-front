'use strict';

angular.module('bhpClient', [
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'lang',
    'auth',
    'wizard',
    'search',
    'apiClient'
]).
config(function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {

    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise('/404');

    var states = [ 
        {
            name: 'start',
            url: '/',
            templateUrl: 'templates/start/start.html'
        },

        {
            name: '404',
            url: '/404',
            templateUrl: 'templates/404.html',
        }
    ];

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    $locationProvider.html5Mode(true);
}).
run(function ($state, authManager) {
    $state.go('start');
});
