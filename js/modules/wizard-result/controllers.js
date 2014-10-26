'use strict'

var WizardResultCtrl = function($scope, $state, $stateParams, searchManager) {
	var self = this;

	this.query = $stateParams;
	this.result = {};

	// TODO maybe turn this into event listener
    Object.defineProperty(this, 'in_progress', {
        get: function() {
            return searchManager.in_progress;
        }
    });

	$scope.$on('$viewContentLoaded', function() {
		searchManager.wizard_search(self.query.name, self.query.place)
			.then(function(result) {
				self.result = result;
			});
	})
};

WizardResultCtrl.prototype = {

};

angular.module('wizardResult', []).controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);