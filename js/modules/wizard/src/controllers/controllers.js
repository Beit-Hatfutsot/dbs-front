var WizardCtrl = function($state, langManager) {
    var self    = this;
        
    this.name   = '',
    this.place  = '';
    this.$state = $state;

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

    Object.defineProperty(this, 'submit_disabled', {

    	get: function() {
    		if (this.name == '' && this.place == '') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	}
    });

    Object.defineProperty(this, 'show_result', {

        get: function() {

            if (self.$state.current.name == 'wizard-result') {
                return true;
            }

            return false;
        }
    });
};

WizardCtrl.prototype = {

    start: function() {
        this.$state.go('wizard-result', {name: this.name, place: this.place});
    }
};

angular.module('wizard').controller('WizardCtrl', ['$state', 'langManager', WizardCtrl]);
