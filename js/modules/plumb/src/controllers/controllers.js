/*
var StoryCtrl = function($scope, $http, unitConnectionsManager) {
	var self = this;

	setTimeout(function() {
		$http.get('http://public.bh.s3.amazonaws.com/persky_short_view.json').
	    success(function(data) {
	    	self.story = data;

	    	unitConnectionsManager.deferred.getData.resolve(data);
	    }).
	    error(function() {
	    	self.story = null;
	    });
	}, 6000);

	this.resolveCompile = function() {
		unitConnectionsManager.deferred.compile.resolve('');
	}
};

StoryCtrl.prototype = {

};

angular.module('plumb').controller('StoryCtrl', [StoryCtrl]);
*/
