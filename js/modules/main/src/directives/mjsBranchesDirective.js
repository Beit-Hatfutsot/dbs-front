angular.module('main').directive('mjsBranches', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: '<div ng-transclude></div>',
		controller: function($scope) {
			this.selected_branch = null;
			
			Object.defineProperty(this, 'new_branch', {
				get: function() {
					return $scope.mjsCtrl.new_branch;
				}
			});

			this.select_branch = function(branch_index) {
				if (this.selected_branch == branch_index) {
					this.selected_branch = null;
				}
				else{
					this.selected_branch = branch_index;
				}
				this.select_collection([]);
			};

			this.save_story = function() {
				$scope.mjsCtrl.save_story.apply($scope.mjsCtrl);
			};

			this.stopPropagation = function($event) {
				$event.stopPropagation();
			};

			this.select_collection = function(collection) {
				$scope.mjsCtrl.select_collection(collection);
			};

			this.assign_item = function(branch_name, item) {
				$scope.mjsCtrl.assign_item.apply($scope.mjsCtrl, [branch_name, item]);
			};

			this.insert_new_branch = function() {
				$scope.mjsCtrl.insert_new_branch();
			}

			this.remove = function($event, branch_name) {
				$scope.mjsCtrl.remove_branch($event, branch_name);
			};
		}	
	};
});