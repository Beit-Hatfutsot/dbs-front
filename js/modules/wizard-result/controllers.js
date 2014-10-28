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

	$scope.$on('$viewContentLoaded', function() {
		searchManager.wizard_search(self.query.name, self.query.place)
			.then(function(result) {
				self.result = result;
                $scope.wizardController.name = self.query.name;
                $scope.wizardController.place = self.query.place;
			});
	});
};

WizardResultCtrl.prototype = {
    
    view_mode: function(content_type) {
        if (this.result[content_type] && this.result[content_type].length == 1) {
            return 'single';    
        }
        else {
            return 'multiple';
        }
    }
};

angular.module('wizardResult', []).controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);


var SingleResultCtrl = function() {
    
};

SingleResultCtrl.prototype = {

};

angular.module('wizardResult').controller('SingleResultCtrl', [SingleResultCtrl]);

var MultipleResultCtrl = function() {

    this.titles = {
        names: {
            en: 'Family Names',
            he: 'פירושי שמות משפחה'
        },
        places: {
            en: 'Places',
            he: 'קהילות'
        },
        trees: {
            en: 'Family Trees',
            he: 'עצי משפחה'
        }
    };
};

MultipleResultCtrl.prototype = {

};

angular.module('wizardResult').controller('MultipleResultCtrl', [MultipleResultCtrl]);