var ModalDialogCtrl = function($scope, langManager) {
	$scope.max_items_inscroll = 3;
	$scope._Index = 0;
	$scope.isActive = function (index) {
		return $scope._Index === index;
	};
	$scope.isOn = function (index) {
		return $scope._Index === index;
	};
	$scope.showPrev = function () {
		$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.picturesGallery.Pictures.length - 1;
	};

	$scope.showNext = function () {
		$scope._Index = ($scope._Index < $scope.picturesGallery.Pictures.length - 1) ? ++$scope._Index : 0;
	};
	$scope.showPhoto = function (index) {
		$scope._Index = index;
	};
	$scope.hideModal = function() {
        $scope.show = false;
     };
    $scope.isHidden = function(index) {
    	return index < $scope._Index-$scope.max_items_inscroll;
    };

	//this.pic_path = "https://storage.googleapis.com/bhs-flat-pics/" + picturesGallery.Pictures.PictureId + ".jpg";
	Object.defineProperty(this, 'show_arrows', {
        get: function() {
            if ($scope.picturesGallery.Pictures.length > 4) {
                return true;
            }

            return false;
        }
    });
};
	ModalDialogCtrl.prototype = {
		 scrollLeft: function() {
	        if (this.can_scroll_left) {
	        	$scope.view_index--;
	        }
	    }

	};
angular.module('main').controller('ModalDialogCtrl', ['$scope', 'langManager', ModalDialogCtrl]);
