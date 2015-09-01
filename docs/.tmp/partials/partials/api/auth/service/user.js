(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/auth/service/user.html',
    '<header class="api-profile-header"><h1 class="api-profile-header-heading">user</h1><ol class="api-profile-header-structure naked-list step-list"><li>- service in module <a href="api/auth">auth</a></li></ol></header><div class="api-profile-description"><p>A service to handle user data.</p></div><div></div>');
}]);
})();
