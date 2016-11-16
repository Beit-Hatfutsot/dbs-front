var UploadModalController = function($scope, $uibModalInstance, $window, $state) {

    $scope.return = function () {
        $uibModalInstance.dismiss();
    };

    $scope.go_to_story = function() {
        return $state.href('mjs');
    };
};

angular.module('main').controller('UploadModalController', ['$scope', '$uibModalInstance', '$window', '$state', UploadModalController]);
