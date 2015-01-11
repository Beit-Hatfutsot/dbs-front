var ItemCtrl = function($stateParams, item, notification, itemTypeMap, wizard, header, mjs, recentlyViewed) {
	var self = this;

	if (header.sub_header_state !== 'recently-viewed') {
		header.sub_header_state = 'recently-viewed';
	}

	this.notification = notification;
	this.mjs = mjs
	
	this.failed = false;
	this.content_loaded = false;
	this.item_data = {};
	this.related_data = [];
	this.in_mjs = false;
	
	notification.clear();

	notification.put({
		en: 'Fetching item...',
		he: 'טוען פריט...'
	});

	item.get($stateParams.item_string).
		then(function(item_data) {
			recentlyViewed.put(item_data);

			self.item_data = item_data;
			self.item_string = self.item_type + '.' + item_data._id;
			self.content_loaded = true;

			item.get_items(item_data.related).
				then(function(related_data) {
					self.related_data = related_data;
					notification.put({
						en: 'Item loaded successfuly.',
						he: 'הפריט נטען בהצלחה.' 
					});
				}, function() {
					self.fail();
				});

			self.mjs.data.$promise.
				then(function(mjs_data) {
					self.in_mjs = mjs.in_mjs(self.item_string);
				});
		}, function() {
			self.fail();
		});

	Object.defineProperty(this, 'item_type', {
		get: function() {
			return itemTypeMap.get_type( this.item_data.UnitType );
		}
	});
};

ItemCtrl.prototype = {
	fail: function() {
		this.failed = true;
		this.notification.put({
			en: 'Failed to fetch item.',
			he: 'טעינת פריט נכשלה.'
		});
	},

	push_to_mjs: function() {
		if ( this.content_loaded && !(this.in_mjs) ) {
			var self = this;
			
			this.mjs.add(this.item_string).then(function() {
				self.in_mjs = true;
			});
		}
	},

	remove_from_mjs: function() {
		if (this.in_mjs) {
			var self = this;		
			
			this.mjs.remove(this.item_string).then(function() {
				self.in_mjs = false;
			});
		}
	}
};

angular.module('main').controller('ItemCtrl', ['$stateParams', 'item', 'notification', 'itemTypeMap','wizard', 'header', 'mjs', 'recentlyViewed', ItemCtrl]);
