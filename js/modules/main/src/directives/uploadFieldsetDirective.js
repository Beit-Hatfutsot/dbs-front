angular.module('main').
	directive('uploadFieldset', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/upload/upload-fieldset.html',
			scope: {
				ctrl: '=',
				upload_form: '=uploadForm',
				rc: '=',
				lang: '@',
				isRequired: '='
			}
		}
	}]);