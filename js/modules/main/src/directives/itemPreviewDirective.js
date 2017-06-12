
angular.module('main').directive('itemPreview', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/main/item-preview.html',
		scope: {
			previewData: '=',
			hideText: '=',
			removable: '=',
			itemSource: '@'
		},
     link: function(scope, element) {
      /*building person data*/
            var children = [];
            try {
                scope.previewData.partners.forEach(function(partner) {
                    partner.children.forEach(function(child) {
                        children.push(child.name[0]);
                    })
                });
                scope.children = children.join(", ");
                scope.children_num = children.length;
            }
            catch (er) {
                scope.children = [];
            };
            var sex = scope.previewData.sex;
			// build the person info
            var person_info = "(";
            person_info += scope.previewData.birth_year || '?';
            person_info += ' - ';
            person_info += scope.previewData.death_year || '?';
            if (person_info == '(? - ?')
                person_info = '';
            else
                person_info += ') ';

		    var birth_place = scope.previewData.birth_place;
            if (birth_place) {
                var bp = birth_place.toLowerCase();
                if ((bp[0]>='a') && (bp[0] <= 'z'))
                    person_info += 'Born in '+birth_place;
                else
                    if(sex == 'F')
                        person_info += 'נולדה ב'+birth_place;
                    else if (sex == 'M')
                        person_info += 'נולד ב'+birth_place;
                    else
                        person_info += 'נולד ב'+birth_place;

                person_info += ' , '
            }
		    var death_place = scope.previewData.death_place;
            if (death_place) {
                var dp = death_place.toLowerCase();
                if ((dp[0]>='a') && (dp[0] <= 'z'))
                    person_info += 'Died in '+death_place;
                else
                    if (sex == 'F')
                        person_info += 'נפטרה ב'+death_place;
                    else if (sex == 'M')
                        person_info += 'נפטר ב'+death_place;
                    else
                        person_info += 'נפטר ב'+death_place;

                person_info += ' '
            }
            scope.person_info = person_info;
        },
		controller: 'ItemPreviewCtrl as itemPreviewController'
	};
});
