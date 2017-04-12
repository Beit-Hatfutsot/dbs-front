var SubHeaderController = function($state, header, suggest, $timeout) {

    this.$state = $state;
    this.header = header;
    this.suggest = suggest;
    this.$timeout = $timeout;
    this.suggested = {};

    this.suggested_open = {
        general: false
    };

    this.suggested_index = {
        general: -1
    };

    Object.defineProperty(this, 'raw_suggested', {
        get: function() {

            return suggest.suggested;
        }
    });

    Object.defineProperty(this, 'suggested_distribution', {
        get: function() {
            return {
                general: [
                    suggest.suggested.general.exact.length,
                    suggest.suggested.general.starts_with.length,
                    suggest.suggested.general.contains.length,
                    suggest.suggested.general.phonetic.length
                ]
            }
        }
    });

    Object.defineProperty(this.suggested, 'general', {
        get: function() {
            return suggest.suggested.general.exact.
                concat(suggest.suggested.general.starts_with.
                    concat(suggest.suggested.general.contains.
                        concat(suggest.suggested.general.phonetic)
                    )
                );
        }
    });
};

SubHeaderController.prototype = {

    get_suggestions: function(type) {
        var promise,
            self = this;

        this.suggested_index[type] = -1;

        if (this.header.query) {
            promise = this.suggest.suggest_general(this.header.query);

            promise.
                then(function() {
                    if (self.suggested[type].length > 0) {
                        self.open_suggested(type);
                    }
                    else {
                        self.close_suggested(type);
                    }
                });
        }
        else {
            this.close_suggested(type);
        }
    },


    open_suggested: function(type) {
        if ( this.suggested[type].length > 0 && this.header.query ) {
            this.suggested_open[type] = true;

        }
    },

    close_suggested: function(type) {
        var self = this;

        this.$timeout(function() {
            self.suggested_open[type] = false;
        }, 200);
    },

    isSelectedSuggested: function(type, value) {
        return this.suggested[type].indexOf(value) === this.suggested_index[type];
    },

    get_active_title: function(type) {
        if (this.suggested_index[type] >= this.suggested_distribution[type][0]) {
            if (this.suggested_index[type] >= this.suggested_distribution[type][0] + this.suggested_distribution[type][1] + this.suggested_distribution[type][2]) {
                return 3;
            }
            if (this.suggested_index[type] >= this.suggested_distribution[type] + this.suggested_distribution[type][1]) {
                return 2;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    },
    select_suggested: function(type, value) {
        this.suggested_index[type] = this.suggested[type].indexOf(value);
    },

    adopt: function(type) {
        this.header.query = this.suggested.general[this.suggested_index.general];
        this.$state.go('general-search', {q: this.header.query});
    },

    handle_keyboard: function($event, type) {
        var suggested_count = this.suggested[type].length;

        if ( !this.suggested_open[type] ) {
            return true;
        }

        if (suggested_count > 0) {
            if($event.keyCode === 40) {
                $event.preventDefault();

                if (this.suggested_index[type] === suggested_count - 1) {
                    this.suggested_index[type] = 0;
                }
                else {
                    this.suggested_index[type] +=1 ;
                }
            }
            else if ($event.keyCode === 38) {
                $event.preventDefault();

                if (this.suggested_index[type] === 0 || this.suggested_index[type] === -1) {
                    this.suggested_index[type] = suggested_count - 1;
                }
                else {
                    this.suggested_index[type] -=1 ;
                }
            }
            else if ($event.keyCode === 13) {
                if (this.suggested[type][ this.suggested_index[type] ]) {
                    $event.preventDefault();
                    this.adopt(type);
                }

                this.close_suggested(type);
            }
        }
    },

    search: function() {
        this.$state.go('general-search', {q: this.header.query});
    },

    search_on_enter:function ($event) {
        if ($event.keyCode === 13 && this.header.query.length > 1)
            this.search();
    }
};

angular.module('main').controller('SubHeaderController', ['$state', 'header', 'suggest', '$timeout', SubHeaderController]);
