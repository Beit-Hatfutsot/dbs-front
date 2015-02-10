angular.module('main').directive('laterName', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        require: ['?ngModel', '^?form'],
        link: function postLink(scope, element, attrs, ctrls) {
            attrs.$set('name', attrs.laterName);
            var modelCtrl = ctrls[0];
            var formCtrl  = ctrls[1];
            if (modelCtrl && formCtrl) {
                modelCtrl.$name = attrs.name;
                formCtrl.$addControl(modelCtrl);
                scope.$on('$destroy', function () {
                    formCtrl.$removeControl(modelCtrl); 
                });
            }
        }
    };
}]);