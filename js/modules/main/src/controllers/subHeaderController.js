var SubHeaderController = function($state, header) {

    this.$state = $state;
    this.header = header;
};

SubHeaderController.prototype = {

    search: function() {
        this.$state.go('general-search', {q: this.header.query});
    }
};

angular.module('main').controller('SubHeaderController', ['$state', 'header', SubHeaderController]);
