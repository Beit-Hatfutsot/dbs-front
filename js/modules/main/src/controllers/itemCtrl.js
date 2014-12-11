var ItemCtrl = function($stateParams, item, notification, itemTypeMap, wizard, header) {
	var self = this;

	this.in_progress = true;
	this.content_loaded = false;
	this.failed = false;
	this.item_data = {};
	
	notification.clear();

	Object.defineProperty(this, 'item_type', {
		get: function() {
			return itemTypeMap.get_type( this.item_data.UnitType );
		}
	});

	notification.put({
		en: 'Fetching item...',
		he: 'טוען פריט...'
	});

	item.get($stateParams.id).
		then(function(item_data) {
			self.item_data = item_data;
			self.content_loaded = true;
			notification.put({
				en: 'Item loaded successfuly.',
				he: 'הפריט נטען בהצלחה.' 
			});
		}, function() {
			self.failed = true;
			notification.put({
				en: 'Failed to fetch item.',
				he: 'טעינת פריט נכשלה.'
			});
		}).
		finally(function() {
			self.in_progress = false;
		});

	//open sub-header wizard if there is a wizard search result with only one hit (bingo)
	if ( wizard.result.isNotEmpty() ) {
		if ( wizard.result.bingo.name.isEmpty() || wizard.result.bingo.place.isEmpty() )  {
			header.sub_header_state = 'wizard';
		}
	}
};

ItemCtrl.prototype = {

};

angular.module('main').controller('ItemCtrl', ['$stateParams', 'item', 'notification', 'itemTypeMap','wizard', 'header', ItemCtrl]);
