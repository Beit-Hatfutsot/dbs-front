angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var old_value_backup;
				scope.branch_name = scope.mjsCtrl.mjs._latest.story_branches[scope.$index-1];

				element.bind('keydown', function($event) {
					if ($event.keyCode === 13) {
						alter();
					}
				});

				element.bind('blur', function($event) {
					alter();
				});

				function alter() {
					if (scope.branch_name_error) {
						scope.branch_name = old_value_backup;
					}
					else {
						scope.mjsCtrl.rename_branch(scope.$index, scope.branch_name);
					}
					scope.mjsCtrl.branch_edit_status[scope.$index] = false;
					scope.mjsCtrl.in_edit_mode = false;
					scope.mjsCtrl.$scope.$digest();
				};
				
				scope.$watch(function() {return scope.branch_name}, function(newVal, oldVal) {
					old_value_backup = oldVal;

					if (scope.mjsCtrl.mjs._latest.story_branches[scope.$index-1] == newVal || newVal == undefined) {
						scope.branch_name_error = true;
					}
					else {
						scope.branch_name_error = false;
					}
				});
			}
		};
	});