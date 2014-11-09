var WizardResultCtrl = function($scope, $state, $stateParams, searchManager) {
	var self = this;

    this.failed = false;
	this.query = $stateParams;
	this.result = {};
    this.search_again_visible = true;
    this.search_status = '';
    this.suggestions_status = '';

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

	//$scope.$on('$viewContentLoaded', function() {
	
        searchManager.wizard_search(self.query.name, self.query.place)
			.then(function(result) {
	            try {
                    $scope.wizardController.name = self.query.name;
                    $scope.wizardController.place = self.query.place;

                    // set search status
                    if ( result.bingo.name || result.bingo.place )  {
                        
                        if (result.bingo.name && !result.bingo.place) {
                            self.search_status = 'bingo-name';
                        }
                        else if (!result.bingo.name && result.bingo.place) {
                            self.search_status = 'bingo-place';
                        }
                        else {
                            self.search_status = 'bingo';
                        }
                    }
                    else {
                        self.search_status =  'none';
                    }
                    
                    // set suggestions status
                    if ( result.suggestions.name || result.suggestions.place ) {

                        if (result.suggestions.name && !result.suggestions.place) {
                            self.suggestions_status = 'name';
                        }
                        else if (!result.suggestions.name && result.suggestions.place) {
                            self.suggestions_status = 'place';
                        }
                        else {
                            self.suggestions_status = 'both';
                        }
                    }
                    else {
                        self.suggestions_status = 'none';
                    }

                    self.result = result;    
                }
                catch(e) {
                    self.failed = true;
                }    
			}, 
            function() {
                // handle case when connection to search service failed
                self.failed = true;
            });
	//});
};

WizardResultCtrl.prototype = {
    
};

angular.module('wizardResult').controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);


var SingleResultCtrl = function($scope) {
    
};

SingleResultCtrl.prototype = {

};

angular.module('wizardResult').controller('SingleResultCtrl', ['$scope', SingleResultCtrl]);

var NoResultCtrl = function() {
    
};

NoResultCtrl.prototype = {

};

angular.module('wizardResult').controller('NoResultCtrl', [NoResultCtrl]);

var MultipleResultCtrl = function() {

    this.titles = {
    
        trees: {
            en: 'Family Trees',
            he: 'עצי משפחה'
        }
    };
};

MultipleResultCtrl.prototype = {

};

angular.module('wizardResult').controller('MultipleResultCtrl', [MultipleResultCtrl]);