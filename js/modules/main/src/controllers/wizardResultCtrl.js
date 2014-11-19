var WizardResultCtrl = function($scope, $state, $stateParams, searchManager) {
	var self = this;

    this.in_progress = true;
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

	//$scope.$on('$viewContentLoaded', function() {
	
        searchManager.wizard_search(self.query.name, self.query.place)
			.then(function(result) {
	            try {
                    $scope.wizardController.name = self.query.name;
                    $scope.wizardController.place = self.query.place;

                    // set search status
                    if ( result.bingo.name.isNotEmpty() || result.bingo.place.isNotEmpty() )  {
                        
                        if ( result.bingo.name.isNotEmpty() && result.bingo.place.isEmpty() ) {
                            self.search_status = 'bingo-name';
                        }
                        else if ( result.bingo.name.isEmpty() && result.bingo.place.isNotEmpty() ) {
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
                    if ( result.suggestions.name.isNotEmpty() || result.suggestions.place.isNotEmpty() ) {

                        if ( result.suggestions.name.isNotEmpty() && result.suggestions.place.isEmpty() ) {
                            self.suggestions_status = 'name';
                        }
                        else if ( result.suggestions.name.isEmpty() && result.suggestions.place.isNotEmpty() ) {
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
            }).
            finally(function() {
                self.in_progress = false;
            });
	//});
};

WizardResultCtrl.prototype = {
    
};

angular.module('main').controller('WizardResultCtrl', ['$scope', '$state', '$stateParams', 'searchManager', WizardResultCtrl]);
