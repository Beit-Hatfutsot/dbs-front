/**
 * @ngdoc object
 * @name auth.controller:AuthCtrl
 *
 * @description
 * Controller for auth modal template.
 * Handles auth modal scope.
 */
var AuthCtrl = function($scope, $modalInstance, langManager, auth,
						notification, $state, config) {
    var self = this;

    this.$modalInstance = $modalInstance;
    this.auth = auth;
    this.notification = notification;
    this.is_register = config.register;
    this.config = config;
    this.$state = $state;

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
     * @name AuthCtrl#auth_in_progress
     *
     * @description
     * Indicates that an auth request is in progress.
     */
    Object.defineProperty(this, 'auth_in_progress', {
        get: function() {
            return auth.in_progress;
        }
    });

    /**
     * @ngdoc property
     * @name AuthCtrl#signin_data
     *
     * @description
     * Object that binds to the signin form inputs.
     */
    this.signin_data = {
        email:  ''
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
        signin: {
            en: 'Email Me',
            he: 'שליחה'
        },

        processing: {
            en: 'Processing...',
            he: 'עובד...'
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

    	this.auth.signin(this.signin_data.email).
            then(function() {
                self.$modalInstance.close();
                self.notification.put(1);
            }, function() {
                self.$modalInstance.close();
                self.notification.put(10);
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
		if (this.config.mandatory)
			this.$state.go(this.config.fallback_state);
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

angular.module('auth').controller('AuthCtrl', ['$scope', '$modalInstance',
			'langManager', 'auth', 'notification', '$state', 'config', AuthCtrl]);
