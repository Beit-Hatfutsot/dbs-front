angular.module('main').service('itemTypeMap', function() {
	var map = {
		1: 'photoUnits',
    	5: 'places',
    	6: 'familyNames'
	}

	this.get_type = function(description_code) {
		return map[description_code];
	}
});