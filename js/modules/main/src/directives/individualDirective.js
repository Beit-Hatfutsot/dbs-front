angular.module('main').
	directive('individual', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/individual.html',
			scope: {
				individual: '=data',
				treeNumber: '='
			},
			controller: ['$scope', '$state', function($scope, $state) {
				$scope.goto_ftree_item = function(individual_id, tree_number) {
					$state.go('ftree-item', {indi_id: individual_id, gtn: tree_number});
				}
			}]
		};
	}]);