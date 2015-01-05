angular.module('main').
	directive('filtersFudge', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/filters-fudge.html',
			scope: true,
			link: function(scope, element, attrs) {
				Object.defineProperty(scope, 'model', { 
					get: function() {
						return scope.ftreesCtrl.search_params[attrs['model']];
					},
					set: function(newVal) {
						scope.ftreesCtrl.search_params[attrs['model']] = newVal;
					}
				});
				Object.defineProperty(scope, 'fudge_model', {
					get: function() {
						return scope.ftreesCtrl.fudge_factors[attrs['fudgeModel']];
					},
					set: function(newVal) {
						scope.ftreesCtrl.fudge_factors[attrs['fudgeModel']] = newVal;
					}
				});

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