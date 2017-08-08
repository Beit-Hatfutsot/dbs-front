var GalleryModalCtrl = function($scope, langManager, gallery, index, $uibModalInstance) {
    $scope.gallery = gallery;
    $scope.index = (typeof(index) === "undefined") ? 0 : index;
    $scope.lang = langManager.lang;

	$scope.isActive = function (index) {
	    return $scope.index === index;
	};
	$scope.showPrev = function () {
        $scope.index = ($scope.index > 0) ? --$scope.index : $scope.sort_pictures().length - 1;
	};

	$scope.showNext = function () {
        $scope.index = ($scope.index < $scope.sort_pictures().length - 1) ? ++$scope.index : 0;
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
    $scope.sort_pictures = function() {
        // TODO: merge with the itemCtrl sort_pictures
        var pictures = [];
        if (typeof(this.gallery.images) !== "undefined") {
            pictures = this.gallery.images;
        }
        if (typeof(this.pictures) === "undefined" || this.pictures.length !== pictures.length) {
            this.pictures = pictures;
        }
        return this.pictures;
    };

};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$uibModalInstance', GalleryModalCtrl]);
