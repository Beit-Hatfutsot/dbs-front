(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/apiClient.html',
    '<h1><code>apiClient</code></h1><p>This module provides access to BHS API endpoints.</p><h2>Installation</h2><p>First include <code>undefined</code> javascript file in your HTML:</p><p>You can download this file from the following places:</p><ul><li><a href="http://bower.io">Bower</a><br>e.g.<pre><code>bower install angular </code></pre></li></ul><p>Then load the module in your application by adding it as a dependent module:</p><pre><code>angular.module(&#39;app&#39;, [&#39;apiClient&#39;]);</code></pre><p>With that you&apos;re ready to get started!</p><div class="component-breakdown"><h2>Module Components</h2></div>');
}]);
})();
