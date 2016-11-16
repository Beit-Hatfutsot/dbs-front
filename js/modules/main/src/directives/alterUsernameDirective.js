angular.module('main').
    directive('alterUsername', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var old_value_backup;
                var curr_lang = scope.mjsCtrl.langManager.lang;
                scope.username = scope.mjsCtrl.auth.user.name ? scope.mjsCtrl.auth.user.name[curr_lang] : "";
                element.bind('keydown', function($event) {
                    if ($event.keyCode === 13) {
                        alter();
                    }
                });

                element.bind('blur', function($event) {
                    alter();
                });

                function alter() {
                    if (scope.username_error) {
                        scope.username = old_value_backup;
                    }
                    else {
                        scope.mjsCtrl.rename_user(scope.username);
                    }
                    scope.mjsCtrl.in_rename_mode = false;
                    scope.mjsCtrl.$scope.$digest();
                };

                scope.$watch(function() {return scope.username}, function(newVal, oldVal) {
                    old_value_backup = oldVal;

                    if (scope.mjsCtrl.auth.user.name == newVal || newVal == undefined || newVal == "") {
                        scope.username_error = true;
                    }
                    else {
                        scope.username_error = false;
                    }
                });
            }
        };
    });
