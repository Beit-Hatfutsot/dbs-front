var ItemCtrl = function($scope, $state, $stateParams, item, notification, itemTypeMap, wizard, header, mjs, recentlyViewed) {
	var self = this;

	if (header.sub_header_state !== 'recently-viewed') {
		header.sub_header_state = 'recently-viewed';
	}

	this.$stateParams = $stateParams;
	this.item = item;
	this.notification = notification;
	this.mjs = mjs;
	this.recentlyViewed = recentlyViewed;
	
	this.failed = false;
	this.content_loaded = false;
	this.item_data = {};
	this.related_data = [];
	
	if ( $state.lastState.name === 'start' && wizard.result.individuals && wizard.result.individuals.isNotEmpty() ) {
		this.related_individuals = wizard.result.individuals; 

		this.related_individuals_query_params = {}
		if ( wizard.result.name && wizard.result.name.isNotEmpty() ) {
			this.related_individuals_query_params.last_name = wizard.result.name.Header.En;
		}

		if ( wizard.result.place && wizard.result.place.isNotEmpty() ) {
			this.related_individuals_query_params.birth_place = wizard.result.place.Header.En;	
		}
	}

	this.get_item();
	
	Object.defineProperty(this, 'is_ugc_request', {
		get: function() {
			return $stateParams.item_string.substring(0, 3) === 'ugc';
		}
	});

	Object.defineProperty(this, 'item_type', {
		get: function() {
			return itemTypeMap.get_type( this.item_data.UnitType );
		}
	});

	$scope.$on('signin', function() {
		if (self.is_ugc_request) {
			self.get_item();
		}
	});

	notification.put({
		en: 'Loading item...',
		he: 'טוען פריט...'
	});
};

ItemCtrl.prototype = {
	get_item: function() {
		var self = this;

		this.item.get(this.$stateParams.item_string).
			then(function(item_data) {
				self.recentlyViewed.put(item_data);

				self.item_data = item_data;
				self.item_string = self.$stateParams.item_string;
				self.content_loaded = true;

				self.item.get_items(item_data.related).
					then(function(related_data) {
						self.related_data = related_data;
						self.notification.put({
							en: 'Item loaded successfuly.',
							he: 'הפריט נטען בהצלחה.' 
						});
					}, function() {
						self.fail();
					});
			}, function() {
				self.fail();
			});
	},

	fail: function() {
		this.failed = true;
		this.notification.put({
			en: 'Failed to fetch item.',
			he: 'טעינת פריט נכשלה.'
		});
	}
};

angular.module('main').controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'item', 'notification', 'itemTypeMap','wizard', 'header', 'mjs', 'recentlyViewed', ItemCtrl]);
