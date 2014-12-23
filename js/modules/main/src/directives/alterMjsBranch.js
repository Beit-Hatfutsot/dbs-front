angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			require: '^mjsBranches',
			link: function(scope, element, attrs, ctrl) {
				if ( !(scope.imutable) ) {
					element.bind('keydown', function($event) {
						if ($event.keyCode === 13) {
							element[0].blur();
						}
					});
					element.bind('blur', function($event) {
						alter();
					});
				}
				else {
					element.bind('focus', function($event) {
						element.addClass('edit');
						ctrl.new_branch.name = '';
					});
					element.bind('keydown', function($event) {
						if ($event.keyCode === 13) {
							element[0].blur();
						}
					});
					element.bind('blur', function($event) {
						insert();
					});
				}

				function alter() {	
					ctrl.save_story();
				}

				function insert() {
					element.removeClass('edit');
					if (ctrl.new_branch.name != '') {
						ctrl.insert_new_branch();
					}
					else {
						ctrl.new_branch.name = '+';
					}
				}
			}
		};
	});