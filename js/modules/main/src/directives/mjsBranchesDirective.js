angular.module('main').directive('mjsBranches', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: '<div ng-transclude></div>',
		controller: function($scope) {
			this.selected_branch = null;

			this.select_branch = function(branch_index) {
				if (this.selected_branch == branch_index) {
					this.selected_branch = null;
				}
				else{
					this.selected_branch = branch_index;
				}
			};

			this.save_story = function() {
				$scope.mjsCtrl.save_story.apply($scope.mjsCtrl);
			};
		}	
	};
});