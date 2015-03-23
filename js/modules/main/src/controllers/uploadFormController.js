var UploadFormController = function($scope) {
	this.$scope = $scope;
	$scope.uploadCtrl.uploadFormCtrl = this;
	$scope.uploadCtrl.success = false;
	$scope.uploadCtrl.failed = false;
}

angular.module('main').controller('UploadFormController', ['$scope', UploadFormController]);