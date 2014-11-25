var WizardResultCtrl = function($scope, $stateParams, wizard, notification) {
	var self = this;

    this.in_progress = true;
    this.failed = false;
    this.search_status = 'none';
    this.suggestion_status = 'none';
    this.notification = notification;

    Object.defineProperty(this, 'result', {
        get: function() {
            return wizard.result;
        }
    });

    Object.defineProperty(this, 'last_search', {
        get: function() {
            return wizard.last_search;
        }
    });
	
    $scope.mainController.wizard_query.name = $stateParams.name;
    $scope.mainController.wizard_query.place = $stateParams.place;
    
    notification.put({
        en: 'Searching...',
        he: 'מחפש...'
    });
    
    wizard.search($stateParams.name, $stateParams.place)
		.then(function(result) {
            try {
                // set search status
                if ( result.bingo.name.isNotEmpty() || result.bingo.place.isNotEmpty() )  {
                    
                    if ( result.bingo.name.isNotEmpty() && result.bingo.place.isEmpty() ) {
                        self.search_status = 'bingo-name';
                        notification.put({
                            en: 'We have not found a community to match your search.',
                            he: 'לא מצאנו את הקהילה שחיפשתם.'
                        });
                    }
                    else if ( result.bingo.name.isEmpty() && result.bingo.place.isNotEmpty() ) {
                        self.search_status = 'bingo-place';
                        notification.put({
                            en: 'We have not found a surname to match your search.',
                            he: 'לא מצאנו את שם המפשחה שחיפשתם.'
                        });
                    }
                    else {
                        self.search_status = 'bingo';
                        notification.put({
                            en: 'Search finished successfuly.',
                            he: 'החיפוש הסתיים בהצלחה.'
                        });
                    }
                }
                else {
                    self.search_status =  'none';
                    notification.put({
                        en: 'We have not found a name and community to match your search.',
                        he: 'לא מצאנו את שם המשפחה והקהילה שחיפשתם.'
                    });
                }
                
                // set suggestions status
                if ( result.suggestions.name.isNotEmpty() || result.suggestions.place.isNotEmpty() ) {
                    
                    notification.add({
                        en: 'Try using our suggestions below, or search again.',
                        he: 'נסו להעזר בהצעות שלנו מטה, או חפשו שוב.'
                    });
                    
                    if ( result.suggestions.name.isNotEmpty() && result.suggestions.place.isEmpty() ) {
                        self.suggestion_status = 'name';
                    }
                    else if ( result.suggestions.name.isEmpty() && result.suggestions.place.isNotEmpty() ) {
                        self.suggestion_status = 'place';
                    }
                    else {
                        self.suggestion_status = 'both';
                    }
                }
                else {
                    self.suggestion_status = 'none';
                }    
            }
            catch(e) {
                self.fail();
            }    
		}, 
        function() {
            // handle case when connection to search service failed
            self.fail();
        }).
        finally(function() {
            self.in_progress = false;
        });
};

WizardResultCtrl.prototype = {
    
    fail: function() {
        this.failed = true;
        this.notification.put({
            en: 'Search has failed.',
            he: 'החיפוש נכשל.'
        });
    }
};

angular.module('main').controller('WizardResultCtrl', ['$scope', '$stateParams', 'wizard', 'notification', WizardResultCtrl]);
