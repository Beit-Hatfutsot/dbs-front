var ItemPreviewCtrl = function($element, $state, $scope, itemTypeMap, mjs, notification, $window, $document) {
    
    var self = this;
    this.$document = $document;
    this.$state = $state;
    this.$window = $window;
    this.mjs = mjs;
    this.$scope = $scope;
    this.notification = notification;
    this.item_string = itemTypeMap.get_item_string($scope.previewData);
    this.item_type = itemTypeMap.get_type($scope.previewData.UnitType);
    this.branches = $scope.previewData.branches;
    this.url = $scope.previewData.url;
    this.collection_name = itemTypeMap.get_collection_name($scope.previewData);
    this.element = $element.find('div')[0];
    this._rmdialog_is_open = false;
    this.deleted = false;

    jQuery('.mjs').on('hide.bs.dropdown', function(event) {
        console.log(event);
        self._rmdialog_is_open = false;
    });

    Object.defineProperty(this, 'rmdialog_is_open', {
        get: function() {
            return self._rmdialog_is_open;
        },
        set: function(val) {
            self._rmdialog_is_open = val;
        }
    });
};

ItemPreviewCtrl.prototype = {

    get_item_url: function() {
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

    remove_from_story: function() {
        var self = this;
        this.mjs.remove_from_story(this.item_string).success(function() {
            self.deleted = true;
        });
    },

    update_branch: function($event, branch) {
        if (this.branches[branch]) {
            
            this.mjs.add_to_branch(this.item_string, branch); 
        }
        else {
            $event.stopPropagation();
       }
    },

    stopPropagation: function($event) {
        $event.stopPropagation();
    },

};

angular.module('main').controller('ItemPreviewCtrl', ['$element', '$state', '$scope', 'itemTypeMap', 'mjs', 'notification', '$window', '$document', ItemPreviewCtrl]);
