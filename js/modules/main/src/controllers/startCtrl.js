var StartCtrl = function(header) {

	Object.defineProperty(this, 'sub_header_state', {
		get: function() {
			return header.sub_header_state;
		}
	});
};

StartCtrl.prototype = {

};

angular.module('main').controller('StartCtrl', ['header', StartCtrl]);