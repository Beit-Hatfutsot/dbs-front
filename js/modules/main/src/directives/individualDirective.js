angular.module('main').
	directive('individual', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/individual.html',
			scope: {
				individual: '=data',			
				treeNumber: '=',
				isSelected: '='
			},
			controller: ['$scope', '$state', function($scope, $state) {

				$scope.goto_ftree_item = function(individual_id, tree_number) {
					if ($state.includes('ftree-item')) {
						$state.go('ftree-item', {individual_id: individual_id, tree_number: tree_number});
					}
					else {
						$state.go('ftree-view.ftree-item', {individual_id: individual_id, tree_number: tree_number});	
					}
				}
			}]
		};
	}]);