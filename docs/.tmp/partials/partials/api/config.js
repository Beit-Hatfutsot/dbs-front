(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/config.html',
    '<h1><code>config</code></h1><p>A module to hold BHSClient configuration. This Module is compiled by the Grunt replace task in the project Gruntfile.</p><h2>Installation</h2><p>First include <code>undefined</code> javascript file in your HTML:</p><p>You can download this file from the following places:</p><ul><li><a href="http://bower.io">Bower</a><br>e.g.<pre><code>bower install angular </code></pre></li></ul><p>Then load the module in your application by adding it as a dependent module:</p><pre><code>angular.module(&#39;app&#39;, [&#39;config&#39;]);</code></pre><p>With that you&apos;re ready to get started!</p><div class="component-breakdown"><h2>Module Components</h2><div><h3 class="component-heading" id="service">Service</h3><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/config/service/apiConfig">apiConfig</a></td><td><p>A map object for API enpoint names.</p></td></tr></table></div></div>');
}]);
})();
