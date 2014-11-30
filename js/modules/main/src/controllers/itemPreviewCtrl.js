var ItemPreviewCtrl = function($state, $scope, itemTypeMap) {
    this.$state = $state;

    $scope.item_type = itemTypeMap.get_type($scope.preview_data.UnitType);
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
        this.$state.go('item-view', {id: item_data._id.$oid});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', ItemPreviewCtrl]);