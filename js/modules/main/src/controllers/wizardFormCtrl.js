var WizardFormCtrl = function (langManager, wizard) {

	this.wizard = wizard;

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
};

WizardFormCtrl.prototype = {
	search: function() {
        this.wizard.search();
    }
};

angular.module('main').controller('WizardFormCtrl', ['langManager', 'wizard', WizardFormCtrl]);