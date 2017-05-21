var ItemPreviewCtrl = function($state, $scope, itemTypeMap, mjs, item, langManager) {

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
    this.proper_lang = langManager.lang;
};

ItemPreviewCtrl.prototype = {

    get_item_url: function(item_data) {
		// TODO: refactor to user item.get_url
        if (this.url !== undefined) {
            return this.url;
        }
        if (this.collection_name === 'genTreeIndividuals') {
            var state_name = this.proper_lang=='he'?'he.he_person-view':'person-view';
            return this.$state.href(state_name,
                                    {tree_number:item_data.tree_num,
                                    version:item_data.tree_version,
                                    node_id: (item_data.person_id||item_data.id)
                                });
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
        //return this.$state.current.name.includes('mjs');
        var state_name = this.$state.current.name;
        var str = 'mjs';
        return state_name.indexOf(str, state_name.length - str.length) !== -1;
    },

    toggle_height: function() {
        var wrapper = angular.element(document.getElementsByClassName("item-preview-wrapper"))[0];
        wrapper.style.paddingBottom = wrapper.style.paddingBottom == "210px" ? "0" : "210px";
    },

    uc_first: function() {
        var lang = this.proper_lang;
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }

};

angular.module('main').controller('ItemPreviewCtrl', ['$state', '$scope', 'itemTypeMap', 'mjs', 'item', 'langManager', ItemPreviewCtrl]);
