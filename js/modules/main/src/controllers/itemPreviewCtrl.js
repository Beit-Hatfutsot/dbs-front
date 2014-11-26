var ItemPreviewCtrl = function($state, $scope) {
    this.$state = $state;

    var content_type_map = {
    	1: 'photo',
    	5: 'place',
    	6: 'name'
    }

    $scope.content_type = content_type_map[$scope.preview_data.UnitType];
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
        this.$state.go('item-view', {id: item_data._id.$oid});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', ItemPreviewCtrl]);