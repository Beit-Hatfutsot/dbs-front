'use strict';

var MainCtrl = function(langManager, _authManager_) {
    var self = this;

    this.authManager = _authManager_;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	},

    	set: function(language) {
    		langManager.lang = language;
    	}
    });

    Object.defineProperty(this, 'signed_in_user', {
        get: function() {
            return self.authManager.signed_in_user;
        }
    });
}

MainCtrl.prototype = {

	authenticate: function(next_state, mandatory) {
		this.authManager.authenticate(next_state, mandatory);
    }
}

angular.module('bhpClient').controller('MainCtrl', MainCtrl);
