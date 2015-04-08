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
    this.message = {
        en: '',
        he: ''
    };

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
    };

    this.submit_values = {
        register: {
            en: 'Register', 
            he: 'הרשמה'
        },

        signin: {
            en: 'Sign In', 
            he: 'כניסה'
        }
    };
}

AuthCtrl.prototype = {

    signin: function() {
        var self = this;

    	this.auth.signin(this.signin_data.email, this.signin_data.ps).
            then(function() {
                self.message = {
                    en: 'Sign in succeeded',
                    he: 'הכניסה התבצעה בהצלחה'
                };
                self.$modalInstance.close();
            }, function() {
                self.message = {
                    en: 'Sign in failed',
                    he: 'הכניסה נכשלה'
                };
            });
    },

    register: function() {
        var self = this;

        this.auth.register(this.register_data.name, this.register_data.email, this.register_data.ps).
            then(function() {    
                self.message ={
                    en: 'Registered user ' + self.register_data.email + ' successfuly',
                    he: 'נרשם משתמש ' + self.register_data.email + ' בהצלחה'
                };
                self.$modalInstance.close();
            }, function() {
                self.message = {
                    en: 'Registration failed',
                    he: 'ההרשמה נכשלה'
                };
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
    },

    select_field: function(type) {
        this.selected_field = type;
    }
}

angular.module('auth').controller('AuthCtrl', ['$modalInstance', 'langManager', 'auth', 'isRegister', AuthCtrl]);
