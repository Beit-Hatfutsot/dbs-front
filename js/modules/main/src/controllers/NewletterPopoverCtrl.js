var NewletterPopoverCtrl = function($scope) {

  $scope.popover = {

    isOpen: false,

    open: function open() {
      $scope.popover.isOpen = true;
    },

    close: function close() {
      $scope.popover.isOpen = false;
    }
  };
}

angular.module('main').controller('NewletterPopoverCtrl', ['$scope', NewletterPopoverCtrl]);