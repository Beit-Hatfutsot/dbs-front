angular.module('main').directive('mjsBranch', function() {
	return {
		restrict: 'E',
		require: '^mjsBranches',
		templateUrl: 'templates/main/mjs/mjs-branch.html',
		scope: {
			branch: '=',
			branchIndex: '=',
			imutable: '='
		},
		link: function(scope, element, attrs, ctrl) {
			scope.branchesCtrl = ctrl;
		}
	};
});