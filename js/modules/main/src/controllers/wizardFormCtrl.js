var WizardFormCtrl = function ($timeout, langManager, wizard, suggest) {

    this.$timeout = $timeout;
	this.wizard = wizard;
    this.suggest = suggest;

	this.placeholders = { 
        name: {
            en: 'Surname',
            he: 'שם משפחה'
        },
        place: {
            en: 'Place of Origin',
            he: 'מקום'
        }
    };

    this.wizard_query = {};

    this.suggested = {};

    this.suggested_index = {
        name: -1,
        place: -1
    };

    this.suggested_open = {
        name: false,
        place: false
    }

    Object.defineProperty(this, 'name_placeholder', {

        get: function() {
            return this.placeholders.name[langManager.lang];
        }
    });

    Object.defineProperty(this, 'place_placeholder', {

        get: function() {
            return this.placeholders.place[langManager.lang];
        }
    });

    Object.defineProperty(this.wizard_query, 'name', {
        get: function() {
            return wizard.query.name;
        },

        set: function(new_name) {
            wizard.query.name = new_name;
        }
    });

    Object.defineProperty(this.wizard_query, 'place', {
        get: function() {
            return wizard.query.place;
        },

        set: function(new_place) {
            wizard.query.place = new_place;
        }
    });

    Object.defineProperty(this.suggested, 'names', {
        get: function() {
            return suggest.suggested.names;
        }
    });

    Object.defineProperty(this.suggested, 'places', {
        get: function() {
            return suggest.suggested.places;
        }
    });

    Object.defineProperty(this, 'submit_disabled', {

        get: function() {
            if (this.wizard_query_name == '' && this.wizard_query_place == '') {
                return true;
            }
            else {
                return false;
            }
        }
    });
};

WizardFormCtrl.prototype = {
	search: function() {
        this.wizard.search();
    },

    get_suggestions: function(type) {
        this.suggested_index[type] = -1;

        if ( this.wizard_query[type] ) {
            switch (type) {
                case 'name':
                    this.suggest.suggest_names(this.wizard_query.name);
                    break;
                case 'place':
                    this.suggest.suggest_places(this.wizard_query.place);
                    break;
                default:
                    break;
            }
            this.open_suggested(type);
        }
        else {
            this.close_suggested(type);
        }
    },

    // adopt a suggestion for a place or a name
    adopt: function(type) {
        
        switch(type) {
            case 'name':
                this.wizard_query.name = this.suggested.names[ this.suggested_index.name ];
                break;
            case 'place':
                this.wizard_query.place = this.suggested.places[ this.suggested_index.place ];
                break;
            default:
                break;
        }
    },

    handle_keyboard: function($event, type) {
        var suggested_count = this.suggested[type + 's'].length;

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
                $event.preventDefault();
                this.close_suggested(type);
                this.adopt(type);
            }
        }
    },

    isSelectedSuggested: function(type, value) {
        return this.suggested[type + 's'].indexOf(value) === this.suggested_index[type];
    },

    select_suggested: function(type, value) {
        this.suggested_index[type] = this.suggested[type + 's'].indexOf(value); 
    },

    open_suggested: function(type) {
        this.suggested_open[type] = true;
    },

    close_suggested: function(type) {
        var self = this;

        this.$timeout(function() {
            self.suggested_open[type] = false;
        }, 200);
    },
};

angular.module('main').controller('WizardFormCtrl', ['$timeout', 'langManager', 'wizard', 'suggest', WizardFormCtrl]);