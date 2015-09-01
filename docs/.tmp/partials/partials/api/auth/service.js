(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/auth/service.html',
    '<h1>Service components in <code>auth</code></h1><div class="component-breakdown"><div><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/auth/service/auth">auth</a></td><td><p>A service to handle user signin, signout &amp; registration.</p></td></tr><tr><td><a href="api/auth/service/user">user</a></td><td><p>A service to handle user data.</p></td></tr></table></div></div>');
}]);
})();
