/**
 * @ngdoc object
 * @name main.controller:StartController
 *
 * @description
 * The Home page controller.
 */
var StartController = function($scope, $state, wizard, item) {
	var self = this;

	this.wizard = wizard;
	this.lang = $scope.lang.charAt(0).toUpperCase()+$scope.lang.charAt(1);

	/**
	 * @ngdoc property
	 * @name StartController#in_progress
	 *
	 * @description
	 * Indicates that the wizard service is busy
	 * 
	 * @returns {boolean} wizard busy/not busy
	 */
	Object.defineProperty(this, 'in_progress', {
		get: function() {
			return wizard.in_progress;
		}
	});

	// see doc for wizard-search-end event
	$scope.$on('wizard-search-end', function() {
		var slug_text = self.choose_result();

		if (slug_text) {
			item.goto_slug(slug_text);
		}
		else if ('ftree_args' in self.wizard.result)
			$state.go('ftrees', self.wizard.result.ftree_args)
	});
};

StartController.prototype = {
	
	/**
	 * @ngdoc method
	 * @name StartController#choose_result
	 *
	 * @description
	 * Chooses result from wizard results (name/place/ftrees),
	 * according to specified logic (e.g choose name over place if result contains both).
	 * This method taps into the wizard search result, bypassing the wizard search status,
	 * which is something worth considering changing.
	 *
	 * @returns {String} Formatted item string for the selcted item (collection_name._id)
	 */
	choose_result: function() {
		var name = this.wizard.result.name,
			place = this.wizard.result.place;

		if ( name.isNotEmpty() ) {
			return name.Slug[this.lang];
		}
		else if ( place.isNotEmpty() ) {
			return place.Slug[this.lang];
		}
		else {
			return null
		}
	}
}

angular.module('main').controller('StartController', ['$scope', '$state', 'wizard', 'item',StartController]);
