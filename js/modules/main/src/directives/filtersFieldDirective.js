angular.module('main').
	directive('filtersField', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/family-trees/filters-field.html',
			scope: true,
			link: function(scope, element, attrs) {
				scope.label_text_en = attrs['labelTextEn'];
				scope.label_text_he = attrs['labelTextHe'];
				if (attrs['supportTextEn']) {
					scope.support_text_en = attrs['supportTextEn'];
				}
				if (attrs['supportTextHe']) {
					scope.support_text_he = attrs['supportTextHe'];
				}
			}
		};
	}]);