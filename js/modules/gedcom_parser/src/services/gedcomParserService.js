/**
 * @ngdoc service
 * @name gedcomParser
 * @module gedcomParser
 * 
 * @description
 * A wrapper service around the gedcom parser.
 * We use https://github.com/danidin/gedcom-js-viewer to parse gedcom files.
 * The factory for the service instantiates a `GedcomViewer`,
 * and a `GedcomParser` (both classes available on `window`, thanks to the gedcom parsing lib),
 * and returns the `GedcomParser` instance as the service.
 * In order to use the library, we include all of the necessary scripts in our app's index.html.
 */
angular.module('gedcomParser').
	factory('gedcomParser' ,function() {
		var viewer = new GedcomViewer();
		return new GedcomParser();
	});