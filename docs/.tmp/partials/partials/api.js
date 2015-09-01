(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api.html',
    '<h1 id="api">API</h1><p>Select a link in the side menu.</p>');
}]);
})();
