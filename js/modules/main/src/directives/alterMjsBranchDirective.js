angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var old_value_backup, error;

				element.bind('keydown', function($event) {
					if ($event.keyCode === 13) {
						if ( !(scope.branch_name_error) ) {
							element[0].blur();
							scope.mjsCtrl.branch_edit_status[scope.$index] = false;
						}
					}
				});
				element.bind('blur', function($event) {
					alter();
				});

				function alter() {
					if (scope.branch_name_error) {
						scope.branch.name = old_value_backup;
					}
					else {
						scope.mjsCtrl.save_story();
					}
				}
				
				scope.$watch(function() {return scope.branch.name}, function(newVal, oldVal) {
					old_value_backup = oldVal;

					if ( scope.mjsCtrl.is_duplicate_branch_name(newVal) ) {
						scope.branch_name_error = true;
					}
					else {
						scope.branch_name_error = false;
					}
				});
			}
		};
	});