angular.module('main').
	directive('filtersField', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/filters-field.html',
			scope: true,
			link: function(scope, element, attrs) {
				Object.defineProperty(scope, 'model', { 
					get: function() {
						return scope.ctrl.search_params[attrs['model']];
					},
					set: function(newVal) {
						scope.ctrl.search_params[attrs['model']] = newVal;
					}
				});
				Object.defineProperty(scope, 'modifier_model', {
					get: function() {
						return scope.ctrl.search_modifiers[attrs['model']];
					},
					set: function(newVal) {
						scope.ctrl.search_modifiers[attrs['model']] = newVal;
					}
				});

				scope.label_text_en = attrs['labelTextEn'];
				scope.label_text_he = attrs['labelTextHe'];
				scope.placeholder= attrs['placeholder'];
				if (attrs['supportTextEn']) {
					scope.support_text_en = attrs['supportTextEn'];
				}
				if (attrs['supportTextHe']) {
					scope.support_text_he = attrs['supportTextHe'];
				}
			}
		};
	}]);
