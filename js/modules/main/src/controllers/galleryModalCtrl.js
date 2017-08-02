var GalleryModalCtrl = function($scope, langManager, gallery, index, $uibModalInstance) {
    $scope.gallery = gallery;
    $scope.index = index;
    $scope.lang = langManager.lang;

	$scope.isActive = function (index) {
	    // TODO: modify for new architecture
		// return $scope.index === index;
        return true;
	};
	$scope.showPrev = function () {
        // TODO: modify for new architecture
        // $scope.index = ($scope.index > 0) ? --$scope.index : $scope.gallery.Pictures.length - 1;
	};

	$scope.showNext = function () {
        // TODO: modify for new architecture
        // $scope.index = ($scope.index < $scope.gallery.Pictures.length - 1) ? ++$scope.index : 0;
	};
	$scope.showPhoto = function (index) {
        // TODO: modify for new architecture
        // $scope.index = index;
	};
	$scope.dismiss = function () {
        $uibModalInstance.dismiss();
    };
    $scope.print = function () {
		window.print();
	};
    $scope.sort_pictures = function() {
        // currently we only support a single main image
        // gallery will be added in #449
        // TODO: merge with the itemCtrl sort_pictures
        var pictures = [];
        if (gallery.main_image_url) {
            pictures = [{"url":gallery.main_image_url}]
        }
        if (typeof(this.pictures) === "undefined" || this.pictures.length !== pictures.length) {
            this.pictures = pictures;
        }
        return this.pictures;
    }
};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$uibModalInstance', GalleryModalCtrl]);
