var PersonsWelcomeCtrl = function($scope, $uibModalInstance, $window, $state) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.dismiss = function () {
        $uibModalInstance.close();
    };

    $scope.go_to_tree = function(tree_num, node) {
        return $state.href('person-view', {tree_number: tree_num, node_id: node});
    }
};

angular.module('main').controller('PersonsWelcomeCtrl', ['$scope', '$uibModalInstance', '$window', '$state', PersonsWelcomeCtrl]);
