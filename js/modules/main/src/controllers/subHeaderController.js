var SubHeaderController = function($state, header) {

    this.$state = $state;
    this.header = header;
};

SubHeaderController.prototype = {
    search: function() {
        this.$state.go('general-search', {q: this.header.query});
    },
    
    search_on_enter:function ($event) {
        if ($event.keyCode === 13)
            this.search();
    }
};

angular.module('main').controller('SubHeaderController', ['$state', 'header', SubHeaderController]);
