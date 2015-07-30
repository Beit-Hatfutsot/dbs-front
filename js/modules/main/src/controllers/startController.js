/**
 * @ngdoc object
 * @name main.controller:StartController
 *
 * @description
 * The Home page controller.
 */
var StartController = function($scope, $state, wizard, itemTypeMap) {
	var self = this;

	this.wizard = wizard;
	this.itemTypeMap = itemTypeMap;

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
		var item_string = self.choose_result(); 

		if (item_string) {
			$state.go('item-view', {item_string: item_string});
		}
	});
};

StartController.prototype = {
	
	/**
	 * @ngdoc method
	 * @name StartController#choose_result
	 *
	 * @description
	 * Chooses result from wizard results (name/place),
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
			return this.itemTypeMap.get_item_string(name);
		}
		else if ( place.isNotEmpty() ) {
			return this.itemTypeMap.get_item_string(place);
		}
		else {
			return null
		}
	}
}

angular.module('main').controller('StartController', ['$scope', '$state', 'wizard', 'itemTypeMap', StartController]);