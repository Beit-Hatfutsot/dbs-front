var WizardCtrl = function($state, $scope, $timeout, langManager) {
    var self    = this;
window.s = $scope;
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
};

WizardCtrl.prototype = {

    start: function() {
        this.$state.go('wizard-result', {name: this.name, place: this.place});
    }
};

angular.module('main').controller('WizardCtrl', ['$state', '$scope', '$timeout', 'langManager', WizardCtrl]);
