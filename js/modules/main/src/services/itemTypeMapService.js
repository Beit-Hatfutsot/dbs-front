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

	this.get_item_string = function(item_data) {
		var collection_name = this.get_collection_name(item_data);

		return collection_name + '.' + item_data._id;
	};
});