'use strict';

(function(factory){

	factory([
  "guide",
  "api"
]);

})(typeof angular === 'undefined' ? function(value){
	module.exports = value;
} : function(value){
	angular.module('docApp').value('DOCS_AREA_DATA', value);
});

