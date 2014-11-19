angular.module('main').directive('itemPreview', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/item-preview.html',
		scope: {
			preview_data: '=previewData',
			content_type: '@content'
		},
		controller: 'ItemPreviewCtrl as itemPreviewController'
	};
});


angular.module('main').directive('multipleResult', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/multiple-result.html',
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