angular.module('main').directive('mjsBranches', function() {
	return {
		restrict: 'E',
		
		transclude: true,
		
		template: '<div ng-transclude></div>',
		
		controller: ['$scope', '$timeout', 'plumbConnectionManager', function($scope, $timeout, plumbConnectionManager) {
			var self = this;

			this.selected_branch = null;
			this.dragging = false;

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
				
				var repaint;
				setInterval(function() {
					repaint = jsPlumb.repaintEverything();
				}, 100);
				setTimeout(function() {
					clearInterval(repaint);
				}, 1000);
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
				self.dragging = false;
				$scope.mjsCtrl.assign_item.apply($scope.mjsCtrl, [branch_name, item]);
			};

			this.create_n_assign = function(branch_name, item) {
				self.dragging = false;
				branch_name = 'new branch';
				$scope.mjsCtrl.new_branch.name = branch_name;
				$scope.mjsCtrl.insert_new_branch();	
				$scope.mjsCtrl.assign_item.apply($scope.mjsCtrl, [branch_name, item]);
			};

			this.insert_new_branch = function() {
				$scope.mjsCtrl.insert_new_branch();
			};

			this.remove = function($event, branch_name) {
				$scope.mjsCtrl.remove_branch($event, branch_name);
				this.selected_branch = null;
			};

			$scope.$on('dragstart', function() {
				$scope.$apply(function() {
					self.selected_branch = null;
					self.dragging = true;
				});
			});
			$scope.$on('dragend', function() {
				$scope.$apply(function() {
					self.dragging = false;
					$timeout(function() {
						plumbConnectionManager.connect();
					});
				});
			});
		}],

		link: function(scope, element, attrs, ctrl) {
			scope.branchesCtrl = ctrl;
		}
	};
});