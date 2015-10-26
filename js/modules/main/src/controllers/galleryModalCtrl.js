var GalleryModalCtrl = function($scope, langManager, gallery, $modalInstance) {
	$scope._Index = 0;
    $scope.gallery = gallery;
    
	$scope.isActive = function (index) {
		return $scope._Index === index;
	};
	$scope.showPrev = function () {
		$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.gallery.Pictures.length - 1;
	};

	$scope.showNext = function () {
		$scope._Index = ($scope._Index < $scope.gallery.Pictures.length - 1) ? ++$scope._Index : 0;
	};
	$scope.showPhoto = function (index) {
		$scope._Index = index;
	};
	$scope.dismiss = function () {
        $modalInstance.dismiss();
     };
};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', '$modalInstance', GalleryModalCtrl]);