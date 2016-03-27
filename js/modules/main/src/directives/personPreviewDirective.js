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

            var person_info = "(";
            scope.birth_date = scope.individual.BD;
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
            person_info += (scope.birth_place)?'Born in '+scope.birth_place:'';
            person_info += ' '
            person_info += (scope.death_place)?'Died in '+scope.death_place:'';
            scope.person_info = person_info;
        },
    }})
