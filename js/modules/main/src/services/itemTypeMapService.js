angular.module('main').service('itemTypeMap', function() {

	var map = {
		0: 'genTreeIndividuals',
		1: 'photoUnits',
    	5: 'places',
    	6: 'familyNames',
    	8: 'personalities',
    	9: 'movies', 
    	'IMAGE': 'photoUnits',
    	'VIDEO': 'movies',
    	'TEXT': 'text',
    	'SOUND': 'audio',
    	'3D': '3D',
        'Photographs' : 'photoUnits',
        'Photograph albums' : 'photoUnits',
        'Photographic portraits' : 'photoUnits',
        'Manuscripts': 'text',
	};

	this.get_type = function(description_code) {
		var type;
		if (description_code) {
			type = map[description_code];
		}
		else {
			type = 'genTreeIndividuals';
		} 

		return type;
	};

	this.get_collection_name = function(item_data) {
		if (item_data.ugc) {
			return 'ugc';
		}
		else if (item_data.GTN) {
			return 'genTreeIndividuals';
		}
		else {
			return this.get_type(item_data.UnitType);
		}
	};

	this.get_item_string = function(item_data) {
		if (item_data._id) {
			var collection_name = this.get_collection_name(item_data);
			return collection_name + '.' + item_data._id;
		}
		
		return false;
	};
});