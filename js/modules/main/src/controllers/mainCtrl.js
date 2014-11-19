var MainCtrl = function($state, langManager, wizard, authManager) {
    var self = this;

    this.$state = $state;
    this.search_again_visible = false;
    this.placeholders = { 
        name: {
            en: 'Surname',
            he: 'שם משפחה'
        },
        place: {
            en: 'Place of Origin',
            he: 'מקום'
        }
    },
    this.wizard_query = {
        name: '',
        place: ''
    };

    Object.defineProperty(this, 'wizard_suggestions', {
        get: function() {
            return wizard.result.suggestions;
        }
    });

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	},

    	set: function(language) {
    		langManager.lang = language;
            window.localStorage.language= language;
    	}
    });

    Object.defineProperty(this, 'show_notifications', {
        get: function() {
            if ( $state.includes('start') ) {
                return false;
            }

            return true;
        }
    });

    Object.defineProperty(this, 'signed_in_user', {
        get: function() {
            return authManager.signed_in_user;
        }
    });

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
}

MainCtrl.prototype = {

    start: function() {
        this.$state.go('wizard-result', {name: this.wizard_query.name, place: this.wizard_query.place});
    }
}

angular.module('main').controller('MainCtrl', ['$state', 'langManager', 'wizard', 'authManager', MainCtrl]);
