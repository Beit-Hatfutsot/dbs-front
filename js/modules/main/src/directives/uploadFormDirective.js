angular.module('main').
	directive('uploadForm', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/upload/upload-form.html',
			scope: {
				ctrl: '=',
				metaData: '=',
				type: '@'
			}
		}
	}]);