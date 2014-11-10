
var ItemCtrl = function($scope, $state, $stateParams, itemData) {
	console.log(itemData)
	this.item_data = itemData;
};

ItemCtrl.prototype = {

};

angular.module('item').controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'itemData', ItemCtrl]);
