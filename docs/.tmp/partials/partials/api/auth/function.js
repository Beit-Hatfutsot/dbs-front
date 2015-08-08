(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/auth/function.html',
    '<h1>Function components in <code>auth</code></h1><div class="component-breakdown"><div><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/auth/function/auth.controller:AuthCtrl">auth.controller:AuthCtrl</a></td><td></td></tr></table></div></div>');
}]);
})();
