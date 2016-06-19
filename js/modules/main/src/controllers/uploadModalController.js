var UploadModalController = function($scope, $modalInstance, $window, $state) {

    $scope.return = function () {
        $modalInstance.dismiss();
    };

    $scope.go_to_story = function() {
        return $state.href('mjs');
    };    
};

angular.module('main').controller('UploadModalController', ['$scope', '$modalInstance', '$window', '$state', UploadModalController]);
