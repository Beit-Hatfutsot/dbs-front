var ItemPreviewCtrl = function($state) {
    this.$state = $state;
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
        this.$state.go('item-view', {id: item_data._id.$oid});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', ItemPreviewCtrl]);