angular.module('main').
    directive('fallbackSrc', function () {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.fallbackSrc) {
              attrs.$set('src', attrs.fallbackSrc);
            }
          });

          attrs.$observe('ngSrc', function(value) {
            if (!value && attrs.fallbackSrc) {
              attrs.$set('src', attrs.fallbackSrc);
            }
          });
        }
      }
});
