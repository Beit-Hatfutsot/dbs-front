var WizardResultCtrl = function($scope, $stateParams, wizard, notification) {
	var self = this;

    this.failed = false;
    this.notification = notification;

    Object.defineProperty(this, 'result', {
        get: function() {
            return wizard.result;
        }
    });

    Object.defineProperty(this, 'failed', {
        get: function() {
            return wizard.failed;
        }
    });

    Object.defineProperty(this, 'in_progress', {
        get: function() {
            return wizard.in_progress;
        }
    });
};

WizardResultCtrl.prototype = {
    
};

angular.module('main').controller('WizardResultCtrl', ['$scope', '$stateParams', 'wizard', 'notification', WizardResultCtrl]);
