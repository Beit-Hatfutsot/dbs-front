angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var old_value_backup;
				element.bind('keydown', function($event) {
					if ($event.keyCode === 13) {
						element[0].blur();
						scope.mjsCtrl.branch_edit_status[scope.$index] = false;
					}
				});
				element.bind('blur', function($event) {
					if(scope.myname != " ") {
						scope.mjsCtrl.update_branch_name(scope.$index, scope.myname);
					}
				});
			}
		};
	});
