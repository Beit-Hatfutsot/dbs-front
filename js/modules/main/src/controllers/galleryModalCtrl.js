var GalleryModalCtrl = function($scope, langManager, gallery, index, $uibModalInstance, sorted_pictures) {
    $scope.gallery = gallery;
    $scope.sorted_pictures = sorted_pictures;
    $scope.index = index;
    $scope.lang = langManager.lang;

	$scope.isActive = function (index) {
		return $scope.index === index;
	};
	$scope.showPrev = function () {
		$scope.index = ($scope.index > 0) ? --$scope.index : $scope.sorted_pictures.length - 1;
	};

	$scope.showNext = function () {
		$scope.index = ($scope.index < $scope.sorted_pictures.length - 1) ? ++$scope.index : 0;
	};
	$scope.showPhoto = function (index) {
		$scope.index = index;
	};
	$scope.dismiss = function () {
        $uibModalInstance.dismiss();
    };
    $scope.print = function () {
		window.print();
	};
};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$uibModalInstance', 'sorted_pictures', GalleryModalCtrl]);