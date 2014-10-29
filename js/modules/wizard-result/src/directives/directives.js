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
	};
});

angular.module('wizardResult').directive('multipleResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/wizard-result/multiple-result.html',
		scope: {
			result_data: '=resultData',
			content: '@'
		},
		controller: 'MultipleResultCtrl as multipleResultController',
		link: function(scope) {
			window.s = scope;
			scope.multipleResultController.result_data = scope.result_data;
			scope.multipleResultController.content = scope.content;
		}
	};
});