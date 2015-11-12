var GalleryModalCtrl = function($scope, langManager, gallery, index, $modalInstance) {
    $scope.gallery = gallery;
    $scope.index = index;

	$scope.isActive = function (index) {
		return $scope.index === index;
	};
	$scope.showPrev = function () {
		$scope.index = ($scope.index > 0) ? --$scope.index : $scope.gallery.Pictures.length - 1;
	};

	$scope.showNext = function () {
		$scope.index = ($scope.index < $scope.gallery.Pictures.length - 1) ? ++$scope.index : 0;
	};
	$scope.showPhoto = function (index) {
		$scope.index = index;
	};
	$scope.dismiss = function () {
        $modalInstance.dismiss();
     };
     $scope.print = function () {
		window.print();
	}
};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$modalInstance', GalleryModalCtrl]);