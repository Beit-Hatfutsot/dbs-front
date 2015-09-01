angular.module('main').
	directive('putIf', [function() {
		return {
			restrict: 'E',
			transclude: true,
			template: '<span ng-transclude></span>',
			scope: {
				obj: '=',
				hasKeys: '=',
				hasDefinedKeys: '='
			},
			link: function(scope, element) {
				var show_content = true;

				scope.hasDefinedKeys.forEach(function(key) {
					if (scope.obj[key] == undefined) {
						show_content = false;
					} 
				});

				if (!show_content) {
		        	element.html('');
		        }
			}
		}
	}]);