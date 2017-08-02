var GalleryModalCtrl = function($scope, langManager, gallery, index, $uibModalInstance) {
    $scope.gallery = gallery;
    $scope.index = index;
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
        if ($scope.gallery.collection === "photoUnits") {
            // currently we only support a single main image
            // gallery support will be added in #449
            if ($scope.gallery.main_image_url) {
                pictures = [{"url": $scope.gallery.main_image_url}]
            }
        } else {
            // TODO: move this logic to pipelines, frontend should be source agnostic
            if (typeof($scope.gallery.related_documents) !== "undefined" && typeof($scope.gallery.related_documents["_c6_beit_hatfutsot_bh_base_template_multimedia_photos"]) !== "undefined") {
                related_photo_docs = $scope.gallery.related_documents["_c6_beit_hatfutsot_bh_base_template_multimedia_photos"];
                related_photo_docs.forEach(function(related_photo_doc) {
                    if (related_photo_doc.main_image_url) {
                        pictures.push({"url": related_photo_doc.main_image_url});
                    }
                });
            }
        }
        if (typeof(this.pictures) === "undefined" || this.pictures.length !== pictures.length) {
            this.pictures = pictures;
        }
        return this.pictures;
    };

};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$uibModalInstance', GalleryModalCtrl]);
