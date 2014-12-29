angular.module('main').
	directive('alterMjsBranch', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
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
						scope.mjsCtrl.new_branch.name = '';
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
					scope.mjsCtrl.save_story();
				}

				function insert() {
					element.removeClass('edit');
					if (scope.mjsCtrl.new_branch.name != '') {
						scope.mjsCtrl.insert_new_branch();
					}
					else {
						scope.mjsCtrl.new_branch.name = '+';
					}
				}
			}
		};
	});