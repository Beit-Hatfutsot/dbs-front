
function ItemCtrl($scope, $state, $stateParams, item, notification, itemTypeMap, wizard, header, mjs, recentlyViewed, $window, $timeout, $modal, $rootScope) {
	var self = this;

	this.$modal = $modal;
	this.$state = $state;
	this.slug = item.parse_slug($stateParams.slug_text);
	this.item_type =   this.slug.item_type;
	this.wizard = wizard;
	this.item = item;
	this.notification = notification;
	this.mjs = mjs;
	this.recentlyViewed = recentlyViewed;
	this.$window = $window;
	this.error = null;
	this.content_loaded = false;
	this.item_data = {};
	this.related_data = [];
	this.wizard_name = {};
	this.wizard_place = {};
	this.itemTypeMap = itemTypeMap;
	this.pull_wizard_related();
	this._Index = 0;

	if(this.$window.sessionStorage.wizard_result) {
		this.search_result = JSON.parse(this.$window.sessionStorage.wizard_result);
	}

	var unwatch_item_load = $rootScope.$on('item-loaded', function(event, item) {
		$rootScope.title = item.Header[{'en': 'En', 'he': 'He'}[$rootScope.lang]];
		unwatch_item_load();
	});
	this.get_item();

	$rootScope.$on('language-changed', function (event, lang) {
		$rootScope.title = self.item_data.Header[{'en': 'En', 'he': 'He'}[lang]];
		
	})
	Object.defineProperty(this, 'is_ugc_request', {
		get: function() {
			return this.slug.collection === 'ugc';
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
		this.item.get(this.slug).
			then(function(item_data) {

				self.recentlyViewed.put(
					{state: 'item-view',
					 slug: self.slug,
					 header: item_data.Header,
					 thumbnail: item_data.thumbnail.data
					});
				self.item_data = item_data;
				self.content_loaded = true;
				if (item_data.related)
					self.item.get_items(item_data.related).
						then(function(related_data) {
							self.parse_related_data(related_data);
						});
			},
			function(error) {
				self.error = error;
				self.notification.put({
					en: 'Sorry, failed to fetch item.',
					he: 'מצטערת, טעינת פריט נכשלה.'
				});
			});
	},

	pull_wizard_related: function() {

		if ( this.$state.lastState.name === 'start' ) {
		
			if ( this.wizard.result.name &&
				 this.wizard.result.name.isNotEmpty() /*  &&
				 this.wizard.result.name._id !== _id*/ ) {
				this.wizard_name = angular.copy(this.wizard.result.name);
			}

			if ( this.wizard.result.place &&
				this.wizard.result.place.isNotEmpty() /* &&
				this.wizard.result.place._id !== _id */ )  {
				this.wizard_place = angular.copy(this.wizard.result.place);
			}
		}
	},

	parse_related_data: function(related_data) {
		var self = this;

		related_data.forEach(function(related_item) {
			// push related items after checking they were not pulled from wizard result
			// if ( self.wizard_name._id !== related_item._id && self.wizard_place._id !== related_item._id ) {
			if (related_data.Slug[self.$rootScope.lang] != self.slug.full) {
				self.related_data.push(related_item);
			}
		});
	},

	goto_item: function(item_data) {
        this.$state.go('item-view', {slug: item_data.Slug[this.$rootScope.lang]});
    },

    goto_tree: function() {
    	this.$state.go('ftrees', this.search_result.ftree_args);
	},

	showPrev: function () {
		this._Index = (this._Index > 0) ? --this._Index : this.item_data.Pictures.length - 1;
	},

	showNext: function () {
		this._Index = (this._Index < this.item_data.Pictures.length - 1) ? ++this._Index : 0;
	},

	isActive: function (index) {
		return this._Index === index;
	},
	
	showPhoto: function (index) {
		this._Index = index;
	},

	open_gallery: function (index) {
		if (index == undefined) {
			index = this._Index;
		}
		var body = angular.element(document.getElementsByTagName('body')[0]),
			gallery = this.item_data;

		body.addClass('backdrop');
	    this.$modal.open({
	     	templateUrl: 'templates/main/gallery-modal.html',
	     	controller: 'GalleryModalCtrl as galleryModalController',
	     	size: 'lg',

	     	resolve : {
	     		gallery: function () {
	     			return gallery
	     	},
	     		index: function () {
	     			return index
	     		}
	     	}
	    }).result.finally(function() {
	    	body.removeClass('backdrop');
	    });
	},

	print: function () {
		window.print();
	},

	get_main_pic_index: function() {
		for (var i = 0; i < this.item_data.Pictures.length; i++) {
			var pic = this.item_data.Pictures[i];
			if (pic.IsPreview == "1") {
				return i;
			}
		}
	},

	get_additional_pic_index: function() {
		for (var i = 0; i < this.item_data.Pictures.length; i++) {
			var pic = this.item_data.Pictures[i];
			if (pic.IsPreview == "0") {
				return i;
			}
		}
	},

	get_additional_pic_url: function () {
		return "https://storage.googleapis.com/bhs-flat-pics/" + this.item_data.Pictures[this.get_additional_pic_index()].PictureId + ".jpg";
	}

};

angular.module('main').controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'item', 
											   'notification', 'itemTypeMap','wizard', 'header', 
											   'mjs', 'recentlyViewed', '$window', '$timeout', '$modal', '$rootScope', ItemCtrl]);
