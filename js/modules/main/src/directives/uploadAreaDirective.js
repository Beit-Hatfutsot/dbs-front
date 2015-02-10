angular.module('main').
	directive('uploadArea', function() {
		return {
			restrict: 'E',
			templateUrl: "templates/main/upload/upload-area.html",
			scope: {
				ctrl: '=',
				flowInstanceInit: '=',
				onSuccess: '=',
				onError: '='
			}
		}
	});