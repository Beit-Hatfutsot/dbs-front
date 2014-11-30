angular.module('main').service('itemTypeMap', function() {
	var map = {
		1: 'photo',
    	5: 'place',
    	6: 'name'
	}

	this.get_type = function(description_code) {
		return map[description_code];
	}
});