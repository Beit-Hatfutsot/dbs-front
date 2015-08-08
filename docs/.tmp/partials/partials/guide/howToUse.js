(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/guide/howToUse.html',
    '<h1 id="how-to-use-this-module">How To Use this module</h1><ol><li><p>aaaaaa</p></li><li><p>bbbbbb</p></li></ol>');
}]);
})();
