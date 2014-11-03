angular.module('wizardResult').directive('singleResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/wizard-result/single-result.html',
		scope: {
			result_data: '=resultData'
		}
	};
});

angular.module('wizardResult').directive('noResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/wizard-result/no-result.html',
		scope: {
			content: '@'
		},
		controller: 'NoResultCtrl as noResultController',
		link: function(scope) {
			scope.noResultController.content = scope.content;
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
			scope.multipleResultController.result_data = scope.result_data;
			scope.multipleResultController.content = scope.content;
		}
	};
});