var MjsWidgetController = function($rootScope, $scope, $state, mjs, auth, item) {
  var self = this;

  this.$state = $state;
  this.$scope = $scope
  this.mjs = mjs;
  this.item = item;
  this.auth = auth;
  this.item_tobe_added = false;
  this.item_added = false;

  Object.defineProperty(this, 'signedin', {
    get: function() {
      return auth.is_signedin();
    }
  });


  $scope.$on('loggedin', function (event, user) {
    //check if current item in mjs
    if ($scope.item.isNotEmpty()) {
      var item_slug = item.get_key($scope.item);
      var in_mjs = false;
      user.story_items.every(function(i) {
        if (item_slug == i.id) {
          in_mjs = true;
        }
        return !in_mjs;
      });
      $scope.item.in_mjs = in_mjs;
    }
    });
};

MjsWidgetController.prototype = {
  push_to_mjs: function() {
    var self = this;
    var slug = this.item.get_key(self.$scope.item);
    self.$scope.item.slug = slug;
    if (this.signedin) {
      if (!self.$scope.item.in_mjs) {
        this.mjs.add(self.$scope.item.slug).then(function() {
        // open pop-over
        self.$scope.item.in_mjs = true;
        self.item_added = true;
      });
      }
    }
    else {
      this.item_tobe_added = true;
      this.auth.authenticate({
        mandatory: false
      });
    }
  },

  remove_from_mjs: function() {
    var self = this;
    if(this.$scope.item.in_mjs) {
      var slug = this.item.get_key(this.$scope.item);
      this.mjs.remove(slug).then(function() {
        self.$scope.item.in_mjs = false;
      })
    }
  }
};

angular.module('main').controller('MjsWidgetController', ['$rootScope', '$scope', '$state', 'mjs', 'auth', 'item', MjsWidgetController]);
