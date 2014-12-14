var WizardFormCtrl = function (langManager, wizard, suggest) {

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

    this.suggested_names_index = -1;
    this.suggested_places_index = -1;

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

	Object.defineProperty(this, 'wizard_query_name', {
        get: function() {
            return wizard.query.name;
        },

        set: function(new_name) {
            wizard.query.name = new_name;
        }
    });

    Object.defineProperty(this, 'wizard_query_place', {
        get: function() {
            return wizard.query.place;
        },

        set: function(new_place) {
            wizard.query.place = new_place;
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

    Object.defineProperty(this, 'suggested_names', {
        get: function() {
            return suggest.suggested.names;
        },
        set: function(suggested) {
            suggest.suggested.names = suggested; 
        }
    });

    Object.defineProperty(this, 'suggested_places', {
        get: function() {
            return suggest.suggested.places;
        },
        set: function(suggested) {
            suggest.suggested.places = suggested; 
        }
    });
};

WizardFormCtrl.prototype = {
	search: function() {
        this.wizard.search();
    },

    suggest_names: function() {
        this.suggested_names = [];
        this.suggested_names_index = -1;

        if ( !(this.wizard_query_name === '') ) {
            this.suggest.suggest_names(this.wizard_query_name);
        }
    },

    suggest_places: function() {
        this.suggested_places = [];
        this.suggested_places_index = -1;

        if ( !(this.wizard_query_place === '') ) {
            this.suggest.suggest_places(this.wizard_query_place);
        }
    },

    adopt_name: function(name) {
        this.adopt('name', name);
    },

    adopt_place: function(place) {
        this.adopt('place', place);
    },

    adopt: function(type, value) {
        var suggested_type = 'suggested_' + type + 's';

        this[suggested_type] = [];
        this[suggested_type + '_index'] = -1;
        this['wizard_query_' + type] = value;
    },

    handle_keyboard: function($event, type) {
        var suggested_type = 'suggested_' + type + 's',
            suggested_count = this[suggested_type].length,
            suggested_index = suggested_type + '_index';

        if (suggested_count > 0) {
            if($event.keyCode === 40) {
                $event.preventDefault();
                
                if (this[suggested_index] === suggested_count - 1) {
                    this[suggested_index] = 0;
                }
                else {
                    this[suggested_index] +=1 ;
                }
            }
            else if ($event.keyCode === 38) {
                $event.preventDefault();
                
                if (this[suggested_index] === 0 || this[suggested_index] === -1) {
                    this[suggested_index] = suggested_count - 1;
                }
                else {
                    this[suggested_index] -=1 ;    
                }
            }
            else if ($event.keyCode === 13) {
                $event.preventDefault();
                this.adopt(type, this[suggested_type][ this[suggested_index] ]);
            }
        }
    },

    isSelectedSuggestedName: function(name) {
        return this.isSelectedSuggested('name', name);
    },

    isSelectedSuggestedPlace: function(place) {
        return this.isSelectedSuggested('place', place);
    },

    isSelectedSuggested: function(type, value) {
        var suggested_type = 'suggested_' + type + 's';

        return this[suggested_type].indexOf(value) === this[suggested_type + '_index'];
    },

    select_suggested_name: function(name) {
        this.select_suggested('suggested_names', name);
    },

    select_suggested_place: function(place) {
        this.select_suggested('suggested_places', place);
    },

    select_suggested: function(suggested_type, value) {
        this[suggested_type + '_index'] = this[suggested_type].indexOf(value); 
    }
};

angular.module('main').controller('WizardFormCtrl', ['langManager', 'wizard', 'suggest', WizardFormCtrl]);