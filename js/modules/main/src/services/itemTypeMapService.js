angular.module('main').service('itemTypeMap', function() {
	var map = {
		1: 'photoUnits',
    	5: 'places',
    	6: 'familyNames'
	};

	this.get_type = function(description_code) {
		return map[description_code];
	};

	this.get_collection_name = function(item_data) {
		if (item_data.ugc) {
			return 'ugc';
		}
		else {
			return this.get_type(item_data.UnitType);
		}
	};
});