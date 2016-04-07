var FtreesModalController = function($scope, $modalInstance, $window, $state) {

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.dismiss = function () {
        $window.localStorage.setItem('ftrees-welcome-msg', 'dismissed');
        $scope.cancel();
    };
    $scope.go_to_tree = function(tree_num, node) {
        return $state.href('person-view', {tree_number: tree_num, node_id: node});
    }
};

angular.module('main').controller('FtreesModalController', ['$scope', '$modalInstance', '$window', '$state', FtreesModalController]);