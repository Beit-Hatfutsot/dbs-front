angular.module('main').
    directive('personsField', [function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/main/ftrees/persons-field.html',
            scope: true,

            link: function(scope, element, attrs) {

                scope.text_search_type = [
                    {id: '0', 'label': {'en': 'Exact', 'he': 'מדוייק'}, url_param: 'exact'},
                    {id: '1', 'label': {'en': 'Begins with', 'he': 'מתחיל ב'}, url_param: 'starts'},
                    {id: '2', 'label': {'en': 'Sounds like', 'he': 'נשמע כמו'}, url_param: 'like'},
                ];

                scope.year_search_type = [
                    {id: '0', label: {'en': 'exact', 'he': 'תאריך מדוייק'}, url_param: 'exact'},
                    {id: '1', label: {'en': '+/- year', 'he': 'טווח שנים: 1 +/-'}, url_param: 'pmyears'},
                    {id: '2', label: {'en': '+/-2 years', 'he': 'טווח שנים: 2 +/-'}, url_param: 'pmyears'},
                    {id: '3', label: {'en': '+/-3 years', 'he': 'טווח שנים: 3 +/-'}, url_param: 'pmyears'}
                ];

                Object.defineProperty(scope, 'input', {
                    get: function() {
                        return scope.ctrl.search_params[attrs['model']];
                    },
                    set: function(newVal) {
                        scope.ctrl.search_params[attrs['model']] = newVal;
                    }
                });

                Object.defineProperty(scope, 'selected', {
                    get: function() {
                        //search type == 'year'
                        if (scope.search_type == 'year') {
                            var type = attrs['model'] + '_t';
                            if (scope.ctrl.search_params[type]) {
                                if (scope.ctrl.search_params[type] == 'pmyears') {
                                    var value = attrs['model'] + '_v';
                                    if (scope.ctrl.search_params[value]) {
                                        return scope.year_search_type[scope.ctrl.search_params[value]];
                                    }
                                    else {return scope.year_search_type[2]};
                                }
                                else {return scope.year_search_type[0]};
                            }
                            else {
                                return scope.year_search_type[2];
                            }
                        }
                        //search type == 'text'
                        else {
                            var type = attrs['model'] + '_t';
                            if (scope.ctrl.search_params[type]) {
                                //improve with every
                                var options = ['exact', 'starts', 'like'];
                                for (var i=0; i < options.length; i++) {
                                    if (scope.ctrl.search_params[type] === options[i]) {
                                        return scope.text_search_type[i];
                                    }
                                }
                            }
                            else return scope.text_search_type[0];
                        }
                    },

                    set: function(newVal) {
                        if (scope.search_type == 'year') {
                            scope.ctrl.search_params[attrs['model'] + '_t'] = newVal.url_param;
                            if(newVal.id > 0) {
                                scope.ctrl.search_params[attrs['model'] + '_v'] = newVal.id;
                            }
                            else {
                                if (scope.ctrl.search_params[attrs['model'] + '_v']) {
                                    delete scope.ctrl.search_params[attrs['model'] + '_v'];
                                }
                            }
                        }
                        else {
                            scope.ctrl.search_params[attrs['model'] + '_t'] = newVal.url_param;
                        }
                    }
                });

                scope.label_text_en = attrs['labelTextEn'];
                scope.label_text_he = attrs['labelTextHe'];
                scope.placeholder= attrs['placeholder'];
                scope.search_type = attrs['searchType'];
                scope.input_type = attrs['inputType'];
                if (attrs['supportTextEn']) {
                    scope.support_text_en = attrs['supportTextEn'];
                }
                if (attrs['supportTextHe']) {
                    scope.support_text_he = attrs['supportTextHe'];
                }
            }
        };
    }]);
