(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/guide.html',
    '<h1 id="guide">Guide</h1><p>Select a link to guide page from the side menu.</p>');
}]);
})();
