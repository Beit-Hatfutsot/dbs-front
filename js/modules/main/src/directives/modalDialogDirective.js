angular.module('main').directive('modalDialog', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/modal-dialog.html',
		scope: {
			picturesGallery: '=',
			show: '=',
		},
		controller: 'ModalDialogCtrl as modalDialogController'
	};
});


