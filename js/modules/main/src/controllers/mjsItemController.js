var MjsItemController = function($scope, itemTypeMap) {
	this.collection_name = itemTypeMap.get_collection_name($scope.item);
};

MjsItemController.prototype = {

};

angular.module('main').controller('MjsItemController', ['$scope', 'itemTypeMap', MjsItemController]);