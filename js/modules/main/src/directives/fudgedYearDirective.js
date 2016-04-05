angular.module('main').
	directive('fudgedYear', [function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/main/ftrees/fudged-year.html',
			scope: true,
			scope: {
				searchParam: '=',
				labelTextEn: '@',
				labelTextHe: '@'
			},

			link: function(scope, element, attrs) {
				var parts;
				scope.fudge_options = [
					{id: '0', label: {'en': 'exact', 'he': 'תאריך מדויק'}},
			      	{id: '1', label: {'en': '+/- year', 'he': 'טווח שנים: 1 +/-'}},
			      	{id: '2', label: {'en': '+/-2 years', 'he': 'טווח שנים: 2 +/-'}}
				];
				if (scope.searchParam) {
					parts = scope.searchParam.split(':');
				}
				else {
					parts = [null, '2']
				}
				parts[0] = parseInt(parts[0])

				Object.defineProperty(scope, 'year', { 
					get: function() {
						return parts[0];
					},
					set: function(newVal) {
						parts[0] = newVal;
						scope.searchParam = (scope.fudge.id > 0)?parts.join(':'):parts[0];
					}
				});

				Object.defineProperty(scope, 'fudge', {
					get: function() {
						return scope.fudge_options[parseInt(parts[1]||0)];
					},
					set: function(newVal) {
						parts[1] = newVal.id;
						scope.searchParam = (scope.fudge.id > 0)?parts.join(':'):parts[0];
					}
				});
			}
		};
	}]);