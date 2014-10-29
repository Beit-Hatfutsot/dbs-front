'use strict';

var AuthCtrl = function($modalInstance, langManager, authManager) {
    var self = this;

    this.$modalInstance = $modalInstance;
    this.authManager = authManager;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	}
    });

    // user name
    this.iare = '';

    // password
    this.ias = '';

    // auth message to display to the user
    this.message = '';
}

AuthCtrl.prototype = {

    signin: function() {
        var self = this;

    	this.authManager.signin(this.iare, this.ias).
            then(function() {    
                self.message = 'Sign in succeeded';
                self.$modalInstance.close();
            }, function() {
                self.message = 'Sign in failed';
            });
    },

    dismiss: function() {
        this.$modalInstance.dismiss();
    }
}

angular.module('auth').controller('AuthCtrl', ['$modalInstance', 'langManager', 'authManager', '$http', AuthCtrl]);

