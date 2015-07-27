/**
 * @ngdoc object
 * @name auth.controller:AuthCtrl
 *
 * @description
 * Controller for auth modal template.
 * Handles auth modal scope.
 */
var AuthCtrl = function($scope, $modalInstance, langManager, auth, isRegister) {
    var self = this;

    this.$modalInstance = $modalInstance;
    this.auth = auth;
    this.is_register = isRegister;

    /**
     * @ngdoc property
     * @name AuthCtrl#lang
     *
     * @description
     * Passes the `lang` property from langManager.
     * Probably should be removed & replaced in the template, 
     * since there is a `lang` property on $rootScope,
     * unless `lang` is removed from $rootScope.
     */
    Object.defineProperty(this, 'lang', {
        get: function() {
            return langManager.lang;
        }
    });


    /**
     * @ngdoc property
     * @name AuthCtrl#selected_field
     *
     * @description
     * Key of the currently selected field.
     * Used to toggle input label class.
     */
    this.selected_field = null;

    /**
     * @ngdoc property
     * @name AuthCtrl#signin_data
     *
     * @description
     * Object that binds to the signin form inputs.
     */
    this.signin_data = {
        email:  '',
        ps:     ''
    };


    /**
     * @ngdoc property
     * @name AuthCtrl#register_data
     *
     * @description
     * Object that binds to the registration form inputs.
     */
    this.register_data = {
        name:   '',
        email:  '',
        ps:     ''
    };


    /**
     * @ngdoc property
     * @name AuthCtrl#message
     *
     * @description
     * English & Hebrew messages to display to the user.
     */
    this.message = {
        en: '',
        he: ''
    };

    /**
     * @ngdoc property
     * @name AuthCtrl#placeholders
     *
     * @description
     * English & Hebrew form placeholders.
     */
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

    /**
     * @ngdoc property
     * @name AuthCtrl#submit_values
     *
     * @description
     * Engilsh & Hebrew submit button values.
     */
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

    /**
     * @ngdoc method
     * @name AuthCtrl#signin
     *
     * @description
     * Calls method signin of {@link module:auth.service:auth} service, using signin form data.
     * Defines the success and failure messages, displayed upon modal dismissal. 
     */
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

    /**
     * @ngdoc method
     * @name AuthCtrl#register
     *
     * @description
     * Calls method register of {@link module:auth.service:auth} service, using registration form data.
     * Defines the success and failure messages, displayed upon modal dismissal. 
     */
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

    /**
     * @ngdoc method
     * @name AuthCtrl#dismiss
     *
     * @description
     * Dismisses the auth modal.
     */
    dismiss: function() {
        this.$modalInstance.dismiss();
    },


    /**
     * @ngdoc method
     * @name AuthCtrl#goto_register
     *
     * @description
     * Switches the auth modal to registration mode.
     */
    goto_register: function() {
        this.is_register = true;
    },


    /**
     * @ngdoc method
     * @name AuthCtrl#goto_register
     *
     * @description
     * Switches the auth modal to signin mode.
     */
    goto_signin: function() {
        this.is_register = false;
    },

    /**
     * @ngdoc method
     * @name AuthCtrl#select_field
     *
     * @description
     * Sets the selected_field property.
     *
     * @param {String} key key of the selected field
     */
    select_field: function(key) {
        this.selected_field = key;
    }
}

angular.module('auth').controller('AuthCtrl', ['$scope', '$modalInstance', 'langManager', 'auth', 'isRegister', AuthCtrl]);
