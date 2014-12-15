var ItemCtrl = function($stateParams, item, notification, itemTypeMap, wizard, header) {
	var self = this;

	this.notification = notification;

	this.failed = false;
	this.content_loaded = false;
	this.item_data = {};
	this.related_data = [];
	
	notification.clear();

	notification.put({
		en: 'Fetching item...',
		he: 'טוען פריט...'
	});

	item.get($stateParams.item_string).
		then(function(item_data) {
			self.item_data = item_data;
			self.content_loaded = true;

			item.get_related(item_data.related).
				then(function(related_data) {
					self.related_data = related_data;
					notification.put({
						en: 'Item loaded successfuly.',
						he: 'הפריט נטען בהצלחה.' 
					});
				}, function() {
					self.fail();
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
	}
};

angular.module('main').controller('ItemCtrl', ['$stateParams', 'item', 'notification', 'itemTypeMap','wizard', 'header', ItemCtrl]);
