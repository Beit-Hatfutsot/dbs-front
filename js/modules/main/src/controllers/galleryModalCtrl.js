var GalleryModalCtrl = function($scope, langManager, gallery, index, $uibModalInstance) {
    $scope.gallery = gallery;
    $scope.index = index;
    $scope.lang = langManager.lang;

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
        $uibModalInstance.dismiss();
    };
    $scope.print = function () {
		window.print();
	};
    $scope.sort_pictures = function() {
        var digitized = [],
            nondigitized = [];
        for (var i = 0; i < gallery.Pictures.length; i++) {
            var pic = gallery.Pictures[i];
            if(pic.PictureId !== '') {
                digitized.push(pic);
            }
            else {
                nondigitized.push(pic);
            }
        }
        digitized.push.apply(digitized, nondigitized);
        return digitized;
    }
};

angular.module('main').controller('GalleryModalCtrl', ['$scope', 'langManager', 'gallery', 'index', '$uibModalInstance', GalleryModalCtrl]);
