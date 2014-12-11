var WizardResultCtrl = function(wizard) {
	var self = this;

    Object.defineProperty(this, 'result', {
        get: function() {
            return wizard.result;
        }
    });

    Object.defineProperty(this, 'search_status', {
        get: function() {
            return wizard.search_status;
        }
    });

    Object.defineProperty(this, 'last_search_name', {
        get: function() {
            return wizard.last_search.name;
        }
    });

    Object.defineProperty(this, 'last_search_place', {
        get: function() {
            return wizard.last_search.place;
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

angular.module('main').controller('WizardResultCtrl', ['wizard', WizardResultCtrl]);
