'use strict';

var AuthCtrl = function(_$modalInstance_, langManager, _authManager_, _apiClient_) {
    var self = this;

    this.$modalInstance = _$modalInstance_;
    this.authManager = _authManager_;
    this.apiClient = _apiClient_;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	}
    });

    // TODO maybe turn this into event listener
    Object.defineProperty(this, 'in_process', {
        get: function() {
            return self.authManager.in_process;
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
            then(function(response) {
                if (response.meta.code == 200) {
                    self.message = 'Sign in succeeded';
                    self.$modalInstance.close({user: response.response.user});
                } 
                else {
                    self.message = 'Sign in failed';
                }
            }, function() {
                self.message = 'Sign in failed';
            });
    },

    dismiss: function() {
        this.$modalInstance.dismiss();
    }
}

angular.module('auth', []).controller('AuthCtrl', AuthCtrl);

