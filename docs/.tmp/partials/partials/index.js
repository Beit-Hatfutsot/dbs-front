(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/index.html',
    '<div class="jumbotron"><h1>Hello Docs!</h1></div><h2 id="contents">Contents</h2><h3 id="api">API</h3><p><a href="api">here</a>.</p><h3 id="guide">Guide</h3><p><a href="guide">here</a>.</p>');
}]);
})();
