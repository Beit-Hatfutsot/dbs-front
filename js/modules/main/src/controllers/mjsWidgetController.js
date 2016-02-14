var MjsWidgetController = function($scope, $state, mjs, auth, item) {
	var self = this;

	this.$state = $state;
	this.$scope = $scope
	this.mjs = mjs;
	this.auth = auth;
	this.item_tobe_added = false;
	this.item_added = false;
	this.item_data = $scope.item;
	this.item_string = item.get_data_string(self.item_data);

	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});
	
	$scope.$on('signin', function() {
		mjs.refresh().
			then(function() {
				if (self.item_tobe_added) {
					self.mjs.add(self.item_string).
						then(function() {
							// open pop-over
							self.item_added = true;
							self.item_tobe_added = false;
						});
				}
			});
	});
};

MjsWidgetController.prototype = {
	push_to_mjs: function() {
		var self = this;
		if (this.signedin) {
			if (!this.item_data.in_mjs) {
				this.mjs.add(this.item_string).then(function() {
					// open pop-over
					self.item_data.in_mjs = true;
					self.item_added = true;
				});
			}
		}
		else {
			this.item_tobe_added = true;
			this.auth.authenticate({
				mandatory: false
			});
		}
	},

	remove_from_mjs: function() {
		var self = this;
		if(this.item_data.in_mjs && !(this.item_data.ugc)) {
			this.mjs.remove_from_story(this.item_string);	
		}
		self.item_data.in_mjs = false;
	}
};

angular.module('main').controller('MjsWidgetController', ['$scope', '$state', 'mjs', 'auth', 'item', MjsWidgetController]);
