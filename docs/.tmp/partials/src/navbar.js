(function(module) {
try {
  module = angular.module('docApp');
} catch (e) {
  module = angular.module('docApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('src/navbar.html',
    '<nav class="navbar navbar-static-top navbar-inverse" ng-controller="NavbarCtrl as navbar"><div class="navbar-header"><a class="navbar-brand" href="#/index"><span class="glyphicon glyphicon-home"></span> bhsclient&nbsp;Docs</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-6"><ul class="nav navbar-nav"><li ng-repeat="area in navbar.areas" ng-class="{active:docs.currentArea.id === area.id}"><a ng-href="{{area.href}}">{{area.name}}</a></li></ul></div></nav>');
}]);
})();
