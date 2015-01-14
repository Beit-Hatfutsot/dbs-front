var FtreeViewController = function($scope, $stateParams) {
	if ($scope.ftreesCtrl.individuals.isNotEmpty()) {
		$scope.ftreesCtrl.select_individual( $scope.ftreesCtrl.individuals[$stateParams.ind_index] );
	}
	$scope.$on('search-end', function() {
		$scope.ftreesCtrl.select_individual( $scope.ftreesCtrl.individuals[$stateParams.ind_index] );
	})
}

angular.module('main').controller('FtreeViewController', ['$scope', '$stateParams', FtreeViewController]);