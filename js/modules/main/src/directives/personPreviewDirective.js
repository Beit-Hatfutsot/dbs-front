angular.module('main').directive('personPreview', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/main/ftrees/person-preview.html',
        scope: {
            sex: '=',
            individual: '=',
        },

        link: function(scope, element) {
            var children = [];
            try {
                scope.individual.tree.partners.forEach(function(partner) {
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
            var sex = scope.individual.G;
            var person_info = "(";
            scope.birth_date = scope.individual.BD,
            scope.birth_place = scope.individual.BP;
            scope.death_date = scope.individual.DD;
            scope.death_place = scope.individual.DP;
            person_info += scope.birth_date || '?';
            person_info += ' - ';
            person_info += scope.death_date || '?';
            if (person_info == '(? - ?')
                person_info = ''
            else
                person_info += ') ';
            console.log(person_info);
            if (scope.birth_place) {
                var bp = scope.birth_place.toLowerCase();
                if ((bp[0]>='a') && (bp[0] <= 'z'))
                    person_info += 'Born in '+scope.birth_place;
                else
                    if(sex == 'F')
                        person_info += 'נולדה ב'+scope.birth_place;
                    else if (sex == 'M') 
                        person_info += 'נולד ב'+scope.birth_place;
                    else 
                        person_info += 'נולד ב'+scope.birth_place;

                person_info += ' , '
            }
            if (scope.death_place) {
                var dp = scope.death_place.toLowerCase();
                if ((dp[0]>='a') && (dp[0] <= 'z'))
                    person_info += 'Died in '+scope.death_place;
                else
                    if (sex == 'F')
                        person_info += 'נפטרה ב'+scope.death_place;
                    else if (sex == 'M')
                        person_info += 'נפטר ב'+scope.death_place;
                    else 
                        person_info += 'נפטר ב'+scope.death_place;

                person_info += ' '
            }
            scope.person_info = person_info;
        },
    }})
