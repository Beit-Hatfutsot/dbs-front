var StartController = function($scope, $state, wizard, itemTypeMap) {
	var self = this;

	this.wizard = wizard;
	this.itemTypeMap = itemTypeMap;

	Object.defineProperty(this, 'in_progress', {
		get: function() {
			return wizard.in_progress;
		}
	});

	$scope.$on('wizard-search-end', function() {
		var item_string = self.choose_result(); 

		if (item_string) {
			$state.go('item-view', {item_string: item_string});
		}
	});
};

StartController.prototype = {
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