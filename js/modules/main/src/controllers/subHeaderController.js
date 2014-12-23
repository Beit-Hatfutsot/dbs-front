var SubHeaderController = function(header) {

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

};

angular.module('main').controller('SubHeaderController', ['header', SubHeaderController]);
