angular.module('main').
	directive('uploadFieldset', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/upload/upload-fieldset.html',
			scope: {
				upload_form: '=uploadForm',
				metaData: '=',
				rc: '=',
				fieldsetLang: '@',
				isRequired: '=',
				isBilingual: '='
			},
			controller: ['$scope', function($scope) {
				$scope.select_field = function(type) {
					$scope.selected_field = type;
				}
			}]
		}
	}]);