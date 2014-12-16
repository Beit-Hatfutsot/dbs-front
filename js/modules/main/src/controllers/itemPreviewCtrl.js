var ItemPreviewCtrl = function($state, $scope, itemTypeMap) {
    this.$state = $state;
    this.$scope = $scope;

    $scope.item_type = itemTypeMap.get_type($scope.preview_data.UnitType);
};

ItemPreviewCtrl.prototype = {

    goto_item: function(item_data) {
    	console.log(item_data)
    	var collection_name = this.$scope.item_type;
    	var item_string = collection_name + '.' + item_data._id; 
        this.$state.go('item-view', {item_string: item_string});
    }
};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', ItemPreviewCtrl]);