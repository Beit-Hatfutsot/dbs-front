var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, item) {
    
    var self = this;
    this.$state = $state;
    this.mjs = mjs;
    this.$scope = $scope;
    this.item_string = item.get_data_string($scope.previewData);
    this.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
    this.in_branch = $scope.previewData.in_branch;
    this.url = $scope.previewData.url;
    this.collection_name = itemTypeMap.get_collection_name($scope.previewData);
    this.rmdialog_is_open = false;
};

ItemPreviewCtrl.prototype = {

    get_item_url: function() {
		// TODO: refactor to user item.get_url
        if (this.url !== undefined) {
            return this.url;
        }
        if (this.collection_name === 'genTreeIndividuals') {
            return this.$state.href('ftree-item', {individual_id: this.$scope.previewData.II, tree_number: this.$scope.previewData.GTN});
        }
        else {
			var parts = this.item_string.split('.')
			return this.$state.href('item-view', {collection: parts[0], id: parts[1]});
        }
    },

    remove_from_mjs: function() {
        this.mjs.remove(this.item_string);
    },

    update_branch: function(branch) {
        if (this.in_branch[branch]) {
            this.mjs.add_to_branch(this.item_string, branch); 
        }
        else {
            this.mjs.remove_from_branch(this.item_string, branch);
       }
    },

    stopPropagation: function($event) {
        $event.stopPropagation();
    },

};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', 'mjs', 'item', ItemPreviewCtrl]);
