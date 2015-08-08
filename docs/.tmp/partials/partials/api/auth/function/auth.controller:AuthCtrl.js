(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/auth/function/auth.controller:AuthCtrl.html',
    '<header class="api-profile-header"><h1 class="api-profile-header-heading">auth.controller:AuthCtrl</h1><ol class="api-profile-header-structure naked-list step-list"><li>- function in module <a href="api/auth">auth</a></li></ol></header><div class="api-profile-description"></div><div></div>');
}]);
})();
