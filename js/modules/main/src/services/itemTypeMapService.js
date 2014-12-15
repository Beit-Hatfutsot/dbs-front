angular.module('main').service('itemTypeMap', function() {
	var map = {
		1: 'photoUnit',
    	5: 'place',
    	6: 'familyName'
	}

	this.get_type = function(description_code) {
		return map[description_code];
	}
});