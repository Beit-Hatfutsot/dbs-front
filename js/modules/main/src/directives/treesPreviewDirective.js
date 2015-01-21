angular.module('main').directive('treesPreview', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/trees-preview.html',
		scope: {
			individuals: '=',
			queryParams: '=',
			removable: '='
		},
		controller: 'TreesPreviewController as treesPreviewCtrl'
	};
});
