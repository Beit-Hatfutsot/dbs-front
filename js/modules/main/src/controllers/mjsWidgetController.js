var MjsWidgetController = function($scope, $state, mjs, itemTypeMap, auth) {
	var self = this;

	this.$state = $state;
	this.$scope = $scope
	this.mjs = mjs;
	this.auth = auth;
	this.item_tobe_added = false;
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

	$scope.$watch('item', function(newVal, oldVal) {
		if ( newVal && newVal.isNotEmpty() && !(self.content_loaded) ) {
			self.item_string = itemTypeMap.get_item_string(self.item);
			self.content_loaded = true; 
			mjs.data.$promise.then(function() {
				self.in_mjs = self.mjs.in_mjs(self.item_string);
			});
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
					self.in_mjs = true;
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
		this.mjs.remove_from_story(this.item_string);
		this.mjs.refresh();
		self.in_mjs = false;
		
	/*	if (this.in_mjs && !(this.item.ugc)) {
			this.mjs.remove(this.item_string).then(function () {
				self.in_mjs = false;
			});
		}*/
	}
};

angular.module('main').controller('MjsWidgetController', ['$scope', '$state', 'mjs', 'itemTypeMap', 'auth', MjsWidgetController]);