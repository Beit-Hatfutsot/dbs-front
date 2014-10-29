var WizardResultCtrl = function($scope, $state, $stateParams, searchManager) {
	var self = this;

    this.failed = false;
	this.query = $stateParams;
	this.result = {};
    this.search_again_visible = false;
    this.bingo = true;

	Object.defineProperty(this, 'search_again_button_visible', {
        get: function() {
        	if (self.search_again_visible || self.in_progress)  {
        		return false;
        	}

        	return true;
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

                if ( (self.result.names && self.result.names.length == 0) || (self.result.places && self.result.places.length == 0) )  {
                    
                    self.bingo = false;
                    self.search_again_visible = true;
                }
			}, 
            function() {
                // handle case when connection to search service failed
                self.failed = true;
            });
	});
};

WizardResultCtrl.prototype = {
    
    view_mode: function(content_type) {
        if (this.result[content_type] && this.result[content_type].length == 1) {
            return 'single';    
        }
        else if (this.result[content_type] && this.result[content_type].length > 1) {
            return 'multiple';
        }
    }
};

angular.module('wizardResult').controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);


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