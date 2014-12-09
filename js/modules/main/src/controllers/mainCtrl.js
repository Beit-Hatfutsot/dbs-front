var MainCtrl = function($state, header, langManager, wizard, authManager) {
    var self = this;

    this.$state = $state;
    this.wizard = wizard;
    //this.langManager = langManager;
    this.header = header;
    
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

    Object.defineProperty(this, 'sub_header_state', {
        get: function() {
            return header.sub_header_state;
        },

        set: function(new_state) {
            header.sub_header_state = new_state;
        }
    });

    Object.defineProperty(this, 'search_status', {
        get: function() {
            return wizard.search_status;
        }
    });

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	},

    	set: function(language) {
    		langManager.lang = language;
    	}
    });

    Object.defineProperty(this, 'show_notifications', {
        get: function() {
            if ( ($state.includes('start') && this.search_status == '' && !(wizard.in_progress) && !(wizard.failed)) || this.sub_header_state != 'closed' ) {
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

    search: function() {
        this.wizard.search(this.wizard_query.name, this.wizard_query.place);
    }
}

angular.module('main').controller('MainCtrl', ['$state', 'header', 'langManager', 'wizard', 'authManager', MainCtrl]);
