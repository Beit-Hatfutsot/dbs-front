'use strict';

var WizardCtrl = function() {
    var self = this;

	this.name = '';
	this.place = '';

    Object.defineProperty(this, 'submit_disabled', {

    	get: function() {
    		if (this.name == '' || this.place == '') {
    			return true;
    		}
    		else {
    			return false;
    		}
    	}
    });
}

angular.module('wizard', []).controller('WizardCtrl', WizardCtrl);
