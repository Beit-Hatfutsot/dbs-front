var MainCtrl = function($state, $timeout, langManager, wizard, authManager, notification) {
    var self = this;

    this.sub_header_state = 'closed';

    this.$state = $state;
    this.$timeout = $timeout;
    this.notification = notification;
    this.wizard = wizard;
    this.langManager = langManager;
    
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
            window.localStorage.language= language;
    	}
    });

    Object.defineProperty(this, 'show_notifications', {
        get: function() {
            if ( ($state.includes('start') && this.search_status == '' && !(wizard.in_progress) && !(wizard.failed)) || this.secondary_header_state != 'closed' ) {
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
    },

    set_sub_header_state: function(new_state) {
        var self = this,
            old_state = this.sub_header_state;

        if (old_state == new_state) {
            this.sub_header_state = 'closed';
        }
        else {
            if (old_state == 'closed') {
                this.sub_header_state = new_state;
            }
            else {
                this.$timeout(function() {
                    self.sub_header_state = new_state;
                }, 1000);

                this.sub_header_state = '';
            }
        }
    }
}

angular.module('main').controller('MainCtrl', ['$state', '$timeout', 'langManager', 'wizard', 'authManager', 'notification', MainCtrl]);
