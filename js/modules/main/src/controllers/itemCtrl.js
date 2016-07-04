
function ItemCtrl($scope, $state, $stateParams, item, notification, itemTypeMap, wizard, header, mjs,
				  recentlyViewed, $window, $timeout, $modal, $rootScope, langManager, $location) {
	var self = this;

	this.$modal = $modal;
	this.$state = $state;
	this.slug = item.parse_state($stateParams);
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
	this.itemTypeMap = itemTypeMap;
	this._Index = 0;
	this.lang = langManager.lang;
	this.article_abs_url = $location.absUrl();

	function refresh_root_scope(item) {
		// TODO: make language option 'En' & 'He' universal
		var language_map = {'en': 'En', 'he': 'He'},
			lang = language_map[$rootScope.lang];
		$rootScope.title = item.Header[lang];
		$rootScope.slug = item.Slug;
	};

	if(this.$window.sessionStorage.wizard_result) {
		this.search_result = JSON.parse(this.$window.sessionStorage.wizard_result);
	}

	var unwatch_item_load = $rootScope.$on('item-loaded', function(event, item) {
		refresh_root_scope(item);
		unwatch_item_load();
	});
	this.get_item();

	/*
	$rootScope.$on('language-changed', function (event, lang) {
		self.lang = lang;
		$rootScope.title = self.item_data.Header[{'en': 'En', 'he': 'He'}[lang]];

	})
	*/
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

};

ItemCtrl.prototype = {
	get_item: function() {
		var self = this;
		self.notification.loading(true);
		this.item.get(this.slug).
			then(function(item_data) {

				self.recentlyViewed.put(
					{Slug: item_data.Slug,
					 header: item_data.Header,
					 thumbnail: item_data.thumbnail.data
					});
				self.item_data = item_data;
				self.content_loaded = true;
				if (item_data.related)
					self.item.get_items(item_data.related).
						then(function(related_data) {
							self.parse_related_data(related_data);
							self.notification.loading(false);
						});
				else
					self.notification.loading(false);
			},
			function(error) {
				self.error = error;
				self.notification.put(5);
			});
	},

	parse_related_data: function(related_data) {
		var self = this;
		self.related_data = [];

		related_data.forEach(function(related_item) {
			var proper_lang = self.lang[0].toUpperCase() + self.lang[1];
			if (related_item.Slug[proper_lang] != self.slug.api) {
				self.related_data.push(related_item);
			}
		});
	},

	goto_item: function(item_data) {
		//TODO: rinse the language names
		var lang = this.lang[0].toUpperCase() + this.lang.slice(1),
			slug = item_data.Slug[lang];

		this.item.goto_slug(slug);
    },

    goto_persons: function() {
		var lang = this.lang[0].toUpperCase() + this.lang.slice(1),
			params = {};

		if (this.search_result.name.Header)
		    params.last_name  = this.search_result.name.Header[lang]
    else if (this.search_result.place.Header)
		    params.place = this.search_result.place.Header[lang];

    	this.$state.go('persons', params);
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
		var	gallery = this.item_data;

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
	   'mjs', 'recentlyViewed', '$window', '$timeout', '$modal', '$rootScope',
	   'langManager', '$location', ItemCtrl]);
