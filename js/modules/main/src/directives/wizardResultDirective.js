angular.module('main').
	directive('wizardResult', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/main/wizard-result.html',
			controller: 'WizardResultCtrl as wizardResultController'
		};
	}]);