angular.module('main').directive('mjsBranch', function() {
	return {
		restrict: 'E',
		require: '^mjsBranches',
		templateUrl: 'templates/main/mjs/mjs-branch.html',
		scope: {
			branch: '='
		},
		link: function(scope, element, attrs, ctrl) {
			scope.branch_index = parseInt( attrs['branchIndex'] );
			scope.branchesCtrl = ctrl;
		}
	};
});