angular.module('main').directive('itemPreview', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/item-preview.html',
		scope: {
			previewData: '=',
			hideText: '=',
			removable: '=',
			isExtResult: '='
		},
		controller: 'ItemPreviewCtrl as itemPreviewController'
	};
});
