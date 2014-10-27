'use strict';

angular.module('wizardResult').directive('singleResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/wizard-result/single-result.html',
		scope: {
			result_data: '=resultData'
		},
		controller: 'SingleResultCtrl as singleResultController',
		link: function(scope) {
			scope.singleResultController.result_data = scope.result_data;
		}
	}
});