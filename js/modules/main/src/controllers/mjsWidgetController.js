var MjsWidgetController = function($scope, $state, mjs, itemTypeMap, auth) {
	var self = this;

	this.$state = $state;
	this.$scope = $scope
	this.mjs = mjs;
	this.auth = auth;
	
	this.in_mjs = false;
	this.item_added = false;

	Object.defineProperty(this, 'item', {
		get: function() {
			return $scope.item;
		}
	});
	
	Object.defineProperty(this, 'signedin', {
		get: function() {
			return auth.is_signedin();
		}
	});

	Object.defineProperty(this, 'in_mjs', {
		get: function() {
			if (this.item_added)
				return true
			if (this.signedin && this.content_loaded) {
				return mjs.in_mjs(this.item_string);
			}
			else {
				return false;
			}
		}
	});

	$scope.$watch('item', function(newVal, oldVal) {
		if ( newVal && newVal.isNotEmpty() && !(self.content_loaded) ) {
			self.item_string = itemTypeMap.get_item_string(self.item);
			self.content_loaded = true; 
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
			if ( this.content_loaded && !(this.in_mjs) ) {
				this.mjs.add(this.item_string).then(function() {
					// open pop-over
					debugger;
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
		if (this.in_mjs && !(this.item.ugc)) {
			this.mjs.remove(this.item_string);
		}
	}
};

angular.module('main').controller('MjsWidgetController', ['$scope', '$state', 'mjs', 'itemTypeMap', 'auth', MjsWidgetController]);