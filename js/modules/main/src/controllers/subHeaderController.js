var SubHeaderController = function($state, header) {
    this.query = "";
    this.$state = $state;

	Object.defineProperty(this, 'sub_header_state', {
        get: function() {
            return header.sub_header_state;
        },

        set: function(new_state) {
            header.sub_header_state = new_state;
        }
    });
};

SubHeaderController.prototype = {
    search: function() {
        this.$state.go('general-search', {q: this.query});
    }
};

angular.module('main').controller('SubHeaderController', ['$state', 'header', SubHeaderController]);
