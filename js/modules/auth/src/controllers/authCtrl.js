var AuthCtrl = function($modalInstance, langManager, auth, isRegister) {
    var self = this;

    this.$modalInstance = $modalInstance;
    this.auth = auth;
    this.is_register = isRegister;

    Object.defineProperty(this, 'lang', {
        get: function() {
            return langManager.lang;
        }
    });

    this.signin_data = {
        email:  '',
        ps:     ''
    };

    this.register_data = {
        name:   '',
        email:  '',
        ps:     ''
    };

    // auth message to display to the user
    this.message = '';

    this.placeholders = {
        name: {
            en: 'Name',
            he: 'שם'
        },

        email: {
            en: 'Email',
            he: 'דוא"ל'
        },

        ps: {
            en: 'Password',
            he: 'ססמא'
        }
    }
}

AuthCtrl.prototype = {

    signin: function() {
        var self = this;

    	this.auth.signin(this.signin_data.email, this.signin_data.ps).
            then(function() {
                self.message = 'Sign in succeeded';
                self.$modalInstance.close();
            }, function() {
                self.message = 'Sign in failed';
            });
    },

    register: function() {
        var self = this;

        this.auth.register(this.register_data.name, this.register_data.email, this.register_data.ps).
            then(function() {    
                self.message = 'Registered user' + self.register_data.email + ' successfuly';
                self.$modalInstance.close();
            }, function() {
                self.message = 'Registration failed';
            });
    },

    dismiss: function() {
        this.$modalInstance.dismiss();
    },

    goto_register: function() {
        this.is_register = true;
    },

    goto_signin: function() {
        this.is_register = false;
    }
}

angular.module('auth').controller('AuthCtrl', ['$modalInstance', 'langManager', 'auth', 'isRegister', AuthCtrl]);
