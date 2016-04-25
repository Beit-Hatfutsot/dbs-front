var MjsWidgetController = function($scope, $state, mjs, auth, item) {
	var self = this;

	this.$state = $state;
	this.$scope = $scope
	this.mjs = mjs;
	this.item = item;
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
					self.mjs.add($scope.item.Slug).
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
		var slug = this.item.get_key(self.$scope.item);
		self.$scope.item.slug = slug;

		if (this.signedin) {
			if (!self.$scope.item.in_mjs) {
				this.mjs.add(self.$scope.item.slug).then(function() {
				// open pop-over
				self.$scope.item.in_mjs = true;
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
			this.mjs.remove(self.$scope.item.Slug).then(function() {
				self.item_data.in_mjs = false;
			})	
		}
	}
};

angular.module('main').controller('MjsWidgetController', ['$scope', '$state', 'mjs', 'auth', 'item', MjsWidgetController]);
