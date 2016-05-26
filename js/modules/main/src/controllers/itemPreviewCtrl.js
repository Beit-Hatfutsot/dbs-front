var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, item) {
    
    var self = this;
    this.$state = $state;
    this.mjs = mjs;
    this.$scope = $scope;
    this.item = item;
    this.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
    this.in_branch = $scope.previewData.in_branch;
    this.url = $scope.previewData.url;
    this.collection_name = itemTypeMap.get_collection_name($scope.previewData);
    this.rmdialog_is_open = false;
    this.item_string = item.get_key($scope.previewData);
};

ItemPreviewCtrl.prototype = {

    get_item_url: function(item_data) {
		// TODO: refactor to user item.get_url
        if (this.url !== undefined) {
            return this.url;
        }
        if (this.collection_name === 'genTreeIndividuals') {
            return this.$state.href('ftree-item', {individual_id: this.$scope.previewData.II, tree_number: this.$scope.previewData.GTN});
        }
        else {
			return this.item.get_url(item_data);
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

    in_mjs_state: function() {
        return this.$state.current.name == 'mjs';
    }, 

    toggle_height: function() {
        var wrapper = angular.element(document.getElementsByClassName("item-preview-wrapper"))[0];
        wrapper.style.paddingBottom = wrapper.style.paddingBottom == "210px" ? "0" : "210px";
    }

};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', 'mjs', 'item', ItemPreviewCtrl]);
