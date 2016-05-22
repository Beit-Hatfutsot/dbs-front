var PersonsWelcomeCtrl = function($scope, $modalInstance, $window, $state) {

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.dismiss = function () {
        $window.localStorage.setItem('persons-welcome-msg', 'dismissed');
        $scope.cancel();
    };
    $scope.go_to_tree = function(tree_num, node) {
        return $state.href('person-view', {tree_number: tree_num, node_id: node});
    }
};

angular.module('main').controller('PersonsWelcomeCtrl', ['$scope', '$modalInstance', '$window', '$state', PersonsWelcomeCtrl]);
