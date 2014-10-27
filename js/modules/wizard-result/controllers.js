'use strict'

var WizardResultCtrl = function($scope, $state, $stateParams, searchManager) {
	var self = this;

	this.query = $stateParams;
	this.result = {};
    this.search_again_closed = false;

	Object.defineProperty(this, 'search_again_visible', {
        get: function() {
        	if ( ( (self.result.names && self.result.names.length == 0) || (self.result.places && self.result.places.length == 0) ) && !self.search_again_closed )  {
        		return true;
        	}

        	return false;
        }
    });

	// TODO maybe turn this into event listener
    Object.defineProperty(this, 'in_progress', {
        get: function() {
            return searchManager.in_progress;
        }
    });

    Object.defineProperty(this, 'name_view_mode', {
        get: function() {
        	if (self.result.names && self.result.names.length == 1) {
        		return 'single';	
        	}
        	else {
            	return 'multiple';
        	}
        }
    });


    Object.defineProperty(this, 'place_view_mode', {
        get: function() {
            if (self.result.places && self.result.places.length == 1) {
        		return 'single';	
        	}
        	else {
            	return 'multiple';
        	}
        }
    });

	$scope.$on('$viewContentLoaded', function() {
		searchManager.wizard_search(self.query.name, self.query.place)
			.then(function(result) {
				self.result = result;
                $scope.wizardController.name = self.query.name;
                $scope.wizardController.place = self.query.place;
			});
	})
};

WizardResultCtrl.prototype = {

};

angular.module('wizardResult', []).controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);


var SingleResultCtrl = function($scope) {
    console.log($scope);
};

SingleResultCtrl.prototype = {

};

angular.module('wizardResult', []).controller('SingleResultCtrl', ['$scope', SingleResultCtrl]);