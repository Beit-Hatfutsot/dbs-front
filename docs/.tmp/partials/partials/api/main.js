(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/api/main.html',
    '<h1><code>main</code></h1><h1 id="bhsclient-main-module">BHSClient main module</h1><p>This is the main module for the BHS client. It contains the ui.router state configurations.</p><h2>Installation</h2><p>First include <code>undefined</code> javascript file in your HTML:</p><p>You can download this file from the following places:</p><ul><li><a href="http://bower.io">Bower</a><br>e.g.<pre><code>bower install angular </code></pre></li></ul><p>Then load the module in your application by adding it as a dependent module:</p><pre><code>angular.module(&#39;app&#39;, [&#39;main&#39;]);</code></pre><p>With that you&apos;re ready to get started!</p><div class="component-breakdown"><h2>Module Components</h2><div><h3 class="component-heading" id="directive">Directive</h3><table class="definition-table"><tr><th>Name</th><th>Description</th></tr><tr><td><a href="api/main/directive/icon">icon</a></td><td><p>This directive is an API that enables to use icons located on a sprite image.</p></td></tr></table></div></div>');
}]);
})();
