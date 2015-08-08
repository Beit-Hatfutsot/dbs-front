(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/config/service.html',
    '<h1>Service components in <code>config</code></h1><div class="component-breakdown"><div><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/config/service/apiConfig">apiConfig</a></td><td><p>A map object for API enpoint names.</p></td></tr></table></div></div>');
}]);
})();
