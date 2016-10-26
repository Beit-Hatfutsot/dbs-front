/**
 * @ngdoc object
 * @name main.controller:WizardFormCtrl
 *
 * @description
 * Wizard form controller.
 */
var WizardFormCtrl = function ($timeout, langManager, wizard, suggest, $document) {

    this.$timeout = $timeout;
	this.wizard = wizard;
    this.suggest = suggest;
    this.$document = $document;

    /**
     * @ngdoc property
     * @name WizardFormCtrl#placeholders
     *
     * @description
     * Place holder texts (English & hebrew) for the wizard search fields.
     */
	this.placeholders = {
        name: {
            en: 'Family Name',
            he: 'שם משפחה'
        },
        place: {
            en: 'Place of Origin',
            he: 'מקום'
        }
    };

    /**
     * @ngdoc property
     * @name WizardFormCtrl#wizard_query
     *
     * @description
     * Current wizard query (see {@link wizard})
     */
    this.wizard_query = {};

    /**
     * @ngdoc property
     * @name WizardFormCtrl#suggested
     *
     * @description
     * Holds the suggested names & places.
     */
    this.suggested = {};

    /**
     * @ngdoc property
     * @name WizardFormCtrl#suggested_index
     *
     * @description
     * The indices of the selected name & place suggstions.
     * When none is selected the index is `-1`.
     */
    this.suggested_index = {
        name: -1,
        place: -1
    };

    /**
     * @ngdoc property
     * @name WizardFormCtrl#suggested_open
     *
     * @description
     * Indicates that a name/place suggestion popover is opened
     * (twoway binding - setting one of the properties to true will open a suggestion popover).
     */
    this.suggested_open = {
        name: false,
        place: false
    };

    /**
     * @ngdoc property
     * @name WizardFormCtrl#name_placeholder
     *
     * @description
     * Returns the name field placeholder text according to the currently selected language.
     */
    Object.defineProperty(this, 'name_placeholder', {

        get: function() {
            return this.placeholders.name[langManager.lang];
        }
    });

    /**
     * @ngdoc property
     * @name WizardFormCtrl#place_placeholder
     *
     * @description
     * Returns the place field placeholder text according to the currently selected language.
     */
    Object.defineProperty(this, 'place_placeholder', {

        get: function() {
            return this.placeholders.place[langManager.lang];
        }
    });

    // getters & setters for wizard query. the wizard form inputs bind to this.
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

    // getters & setters for suggested names & places.
    Object.defineProperty(this.suggested, 'names', {
        get: function() {
            return suggest.suggested.names.exact.
                concat(suggest.suggested.names.starts_with.
                    concat(suggest.suggested.names.contains.
                        concat(suggest.suggested.names.phonetic)
                    )
                );
        }
    });
    Object.defineProperty(this.suggested, 'places', {
        get: function() {
            return suggest.suggested.places.exact.
                concat(suggest.suggested.places.starts_with.
                    concat(suggest.suggested.places.contains.
                        concat(suggest.suggested.places.phonetic)
                    )
                );
        }
    });

    /**
     * @ngdoc property
     * @name WizardFormCtrl#raw_suggested
     *
     * @description
     * Getter. Returns suggest.suggested (see {@link suggest})
     */
    Object.defineProperty(this, 'raw_suggested', {
        get: function() {
            return suggest.suggested;
        }
    });

    /**
     * @ngdoc property
     * @name WizardFormCtrl#submit_disabled
     *
     * @description
     * Controls whether the wizard form submit button is disabled.
     * The wizard form should allow submit only if at least one of its inputs holds a value.
     */
    Object.defineProperty(this, 'submit_disabled', {
        get: function() {
            if (this.wizard_query.name == '' && this.wizard_query.place == '') {
                return true;
            }
            else {
                return false;
            }
        }
    });

    /**
     * @ngdoc property
     * @name WizardFormCtrl#sggested_distribution
     *
     * @description
     * Defines suggestion categories within the `suggest.suggested` array.
     * Returns suggestion type distribution.
     * For example, if the suggestions for name contain 1 exact match, 2 "starts-with",
     * 3 "contains" and 1 "sounds like", `suggested_distribution.names` will be: `[1, 2, 3, 1]`.
     *
     * TODO: Condider moving this functionality to `get_suggetions()`,
     * in order to not run the getter function when there was no change in the suggestions.
     */
    Object.defineProperty(this, 'suggested_distribution', {
        get: function() {
            return {
                names: [
                    suggest.suggested.names.exact.length,
                    suggest.suggested.names.starts_with.length,
                    suggest.suggested.names.contains.length,
                    suggest.suggested.names.phonetic.length
                ],
                places: [
                    suggest.suggested.places.exact.length,
                    suggest.suggested.places.starts_with.length,
                    suggest.suggested.places.contains.length,
                    suggest.suggested.places.phonetic.length
                ]
            }
        }
    });
};

WizardFormCtrl.prototype = {

    /**
     * @ngdoc method
     * @name WizardFormCtrl#search
     *
     * @description
     * Trigger a wizard search.
     */
	search: function() {
        this.wizard.search();
        this.$document.duScrollTop();
    },


    /**
     * @ngdoc method
     * @name WizardFormCtrl#get_suggestions
     *
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Get suggestions for name or place.
     */
    get_suggestions: function(type) {
        var promise,
            self = this;

        this.suggested_index[type] = -1;

        if ( this.wizard_query[type] ) {
            switch (type) {
                case 'name':
                    promise = this.suggest.suggest_names(this.wizard_query.name);
                    break;
                case 'place':
                    promise = this.suggest.suggest_places(this.wizard_query.place);
                    break;
                default:
                    break;
            }

            promise.
                then(function() {
                    if (self.suggested[type + 's'].length > 0) {
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

    /**
     * @ngdoc method
     * @name WizardFormCtrl#adopt
     *
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Adopt a suggestion for a place or a name.
     */
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

    /**
     * @ngdoc method
     * @name WizardFormCtrl#handle_keyboard
     *
     * @param $event {Object} event object.
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Hanlder for keyboard events in the wizard formm input context.
     * Used to trigger suggestions dropdown openning, and suggestion picking & adopting.
     */
    handle_keyboard: function($event, type) {
        var suggested_count = this.suggested[type + 's'].length;

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
                if (this.suggested[type + 's'][ this.suggested_index[type] ]) {
                    $event.preventDefault();
                    this.adopt(type);
                }

                this.close_suggested(type);
            }
        }
    },

    /**
     * @ngdoc method
     * @name WizardFormCtrl#isSelectedSuggested
     *
     * @param type {String} suggestion type (name or place).
     * @param value {String} suggestion to check.
     *
     * @description
     * Check whether a suggestion is selected by the user.
     */
    isSelectedSuggested: function(type, value) {
        return this.suggested[type + 's'].indexOf(value) === this.suggested_index[type];
    },

    /**
     * @ngdoc method
     * @name WizardFormCtrl#select_suggested
     *
     * @param type {String} suggestion type (name or place).
     * @param value {String} suggestion to select.
     *
     * @description
     * Mark a suggestion as selected (highlighted).
     */
    select_suggested: function(type, value) {
        this.suggested_index[type] = this.suggested[type + 's'].indexOf(value);
    },

    /**
     * @ngdoc method
     * @name WizardFormCtrl#open_suggested
     *
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Open suggestions dropdown for name or place.
     */
    open_suggested: function(type) {
        if ( this.suggested[type + 's'].length > 0 && this.wizard_query[type] ) {
            this.suggested_open[type] = true;
            this.$document.duScrollToElementAnimated(wizard_form, 130, 500);

        }
    },


    /**
     * @ngdoc method
     * @name WizardFormCtrl#close_suggested
     *
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Close suggestions dropdown for name or place.
     */
    close_suggested: function(type) {
        var self = this;

        this.$timeout(function() {
            self.suggested_open[type] = false;
        }, 200);
    },


    /**
     * @ngdoc method
     * @name WizardFormCtrl#get_active_title
     *
     * @param type {String} suggestion type (name or place).
     *
     * @description
     * Deduce from `suggested_distribution` & `suggested_index`
     * what type of suggestion ("starts with", "contains" or "sounds like") is sleceted.
     */
    get_active_title: function(type) {
        if (this.suggested_index[type] >= this.suggested_distribution[type + 's'][0]) {
            if (this.suggested_index[type] >= this.suggested_distribution[type + 's'][0] + this.suggested_distribution[type + 's'][1] + this.suggested_distribution[type + 's'][2]) {
                return 3;
            }
            if (this.suggested_index[type] >= this.suggested_distribution[type + 's'][0] + this.suggested_distribution[type + 's'][1]) {
                return 2;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    }
};

angular.module('main').controller('WizardFormCtrl', ['$timeout', 'langManager', 'wizard', 'suggest', '$document', WizardFormCtrl]);
