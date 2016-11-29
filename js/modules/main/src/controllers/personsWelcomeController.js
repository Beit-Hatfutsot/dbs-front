var PersonsWelcomeCtrl = function($scope, $uibModalInstance, $window, $state, langManager) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.dismiss = function () {
        $uibModalInstance.close();
    };

    $scope.go_to_tree = function(tree_num, node) {
        var state_name = langManager.lang=='he'?'he.he_person-view':'person-view';
        return $state.href(state_name, {tree_number: tree_num, version: 0, node_id: node});
    }
};

angular.module('main').controller('PersonsWelcomeCtrl', ['$scope', '$uibModalInstance', '$window', '$state', 'langManager', PersonsWelcomeCtrl]);
