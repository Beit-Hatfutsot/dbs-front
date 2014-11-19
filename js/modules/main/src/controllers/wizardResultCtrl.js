var WizardResultCtrl = function($scope, $stateParams, wizard) {
	var self = this;

    this.in_progress = true;
    this.failed = false;
    this.search_status = '';
    this.suggestions_status = '';

    Object.defineProperty(this, 'result', {
        get: function() {
            return wizard.result;
        }
    });
	
    $scope.mainController.wizard_query.name = $stateParams.name;
    $scope.mainController.wizard_query.place = $stateParams.place;
    wizard.search($stateParams.name, $stateParams.place)
		.then(function(result) {
            try {
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
};

WizardResultCtrl.prototype = {
    
};

angular.module('main').controller('WizardResultCtrl', ['$scope', '$stateParams', 'wizard', WizardResultCtrl]);
