angular.module('main').
    directive('fallbackSrc', function () {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.fallbackSrc) {
            //if the picture path returns error, directive sets fallback source
              attrs.$set('src', attrs.fallbackSrc);
              var path = (scope.lang=='en')?'http://www.bh.org.il/about-us/volunteering/':
                          'http://www.bh.org.il/he/%D7%90%D7%95%D7%93%D7%95%D7%AA%D7%99%D7%A0%D7%95/%D7%94%D7%AA%D7%A0%D7%93%D7%91%D7%95%D7%AA-2/';
              //add link
              element[0].parentElement.setAttribute('href', path);
              //cancel open gallery
              element.off('click');
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
