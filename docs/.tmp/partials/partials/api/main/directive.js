(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/main/directive.html',
    '<h1>Directive components in <code>main</code></h1><div class="component-breakdown"><div><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/main/directive/icon">icon</a></td><td><p>This directive is an API that enables to use icons located on a sprite image.</p></td></tr></table></div></div>');
}]);
})();