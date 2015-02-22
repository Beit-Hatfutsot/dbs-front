angular.module('gedcomParser').
	factory('gedcomParser' ,function() {
		var viewer = new GedcomViewer();
		return new GedcomParser();
	});