function ItemCtrl($scope, $state, $stateParams, item, notification, itemTypeMap, wizard, header, mjs,
				  recentlyViewed, $window, $uibModal, $rootScope, langManager, $timeout, $http, $location, apiClient) {
	var self = this;

	this.$uibModal = $uibModal;
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
	this.$rootScope = $rootScope;
	this.proper_link = '';
	this.$http = $http;
	this.host = $location.host();
	this.$timeout = $timeout;
	this.apiClient = apiClient;
	this.proper_lang = this.lang[0].toUpperCase() + this.lang.slice(1);
	this.is_expanded = false;
	this.accordion_is_open = false;
	this.active_font = 's';
	this.font_sizes = {'s':18, 'm':20, 'l':22};
	this.get_item();
	this.sorted_pictures = [];
	this.public_url = $state.href(($rootScope.lang=='en'?'item-view': 'he.he_item-view'),
								 {collection: $stateParams.collection, local_slug: $stateParams.local_slug},
								 {absolute: true});

	Object.defineProperty(this, 'is_expandable', {
		get: function() {
    		var max_height = 598;
			var el = angular.element(document.getElementsByClassName("item__article-texts"))[0];
    		var text_height = el.offsetHeight;
			return text_height == max_height?true:false;
		}
	});

	$rootScope.$on('$stateChangeStart',
	    function(event, toState, toParams, fromState, fromParams) {
	      if (fromState.name.endsWith('item-view') && fromParams.collection == 'video') {
	      	var video_element = angular.element(document.querySelector('.item__content__media-container')).find("video")[0];
			video_element.pause();
	      }
	});

	if(this.$window.sessionStorage.wizard_result) {
		this.search_result = JSON.parse(this.$window.sessionStorage.wizard_result);
	}

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

	refresh_root_scope: function() {
		$rootScope = this.$rootScope;
		var language_map = {'en': 'En', 'he': 'He'},
			lang = language_map[$rootScope.lang],
			item = this.item_data,
			description = {
				5: {
					'En': 'Discover the history of the Jewish community of '+
						  item.Header["En"]+
						  '. Explore photos, family trees and more of the open databases of The Museum of the Jewish People',
				    'He': 'גלו את ההיסטוריה והתרבות של קהילת יהודי ' +item.Header["He"]+
						  ', עצי משפחה, פירוש שמות משפחה, צילומים ועוד במאגרי המידע הפתוחים של בית התפוצות, מוזיאון העם היהודי בתל אביב'
				},

				6: {
					'En': '',
					'He': 'מקור שם משפחה ' +item.Header["He"]+ ' – באתר בית התפוצות ניתן לאתר אילנות יוחסין, פירושים לשמות משפחה, תולדותיהן של קהילות ברחבי העולם, צילומים, תמונות, סרטים ועוד',
				}
			},

			title = {
				//places
				5: {
					'En': 'The Jewish Community of '+ item.Header["En"] + ' | BH Open Databases',
			    	'He': 'קהילת יהודי ' + item.Header["He"] + ' | מאגרי מידע - בית התפוצות'
				},
				//family names
				6: {
					'En': '',
			    	'He': 'מקור השם ' + item.Header["He"]+  ' | מאגרי מידע - בית התפוצות',
				},

				'deflt': {
					'En': item.Header["En"] + ' | BH Open Databases',
				    'He': item.Header["He"] + ' | מאגרי מידע - בית התפוצות'
				}
			},

			keywords = {
				5: {
					'En': 'Jewish community of ' + item.Header["En"] + ', Jews in ' + item.Header["En"],
			    	'He': 'קהילת יהודי ' + item.Header["He"]+ ', יהדות ' + item.Header["He"]+', יהודי ' + item.Header["He"],
				},

				6: {
					'En': '',
					'He': 'מקור שם המשפחה ' + item.Header["He"]+ ', מקור השם '+ item.Header["He"] + ', ' + item.Header["He"],
				}
			};

		$rootScope.keywords = keywords[item.UnitType]?keywords[item.UnitType][lang]:'';
		$rootScope.title = title[item.UnitType]?title[item.UnitType][lang]:title['deflt'][lang];
		$rootScope.description = description[item.UnitType]?description[item.UnitType][lang]:'';
		main_pic_index = this.get_main_pic_index();
		// TODO: make language option 'En' & 'He' universal
		$rootScope.og_type = 'article';



		$rootScope.slug = item.Slug;
		if (main_pic_index !== undefined) {
			$rootScope.og_image = "http://storage.googleapis.com/bhs-flat-pics/" + item.Pictures[main_pic_index].PictureId + ".jpg";
		}
	},

	get_item: function() {
		var self = this;
		self.notification.loading(true);
		this.item.get(this.slug).
			then(function(item_data) {
				self.recentlyViewed.put(
					{Slug: item_data.Slug,
					 header: item_data.Header,
					 thumbnail_url: item_data.thumbnail_url
					});
				self.item_data = item_data;
				self.sorted_pictures = self.sort_pictures(self.item_data);
				self.proper_link = self.item.get_url(self.item_data);
				self.content_loaded = true;
				self.refresh_root_scope();
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
				if (error.status == '404') {
					self.$state.go('404');
				}
				else {
					self.notification.put(5, error.status);
				}
			});
	},

	parse_related_data: function(related_data) {
		var self = this;
		self.related_data = [];

		related_data.forEach(function(related_item) {
			var proper_lang = self.lang[0].toUpperCase() + self.lang[1];
			if (related_item.Slug && related_item.Slug[proper_lang] != self.slug.api) {
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
		this._Index = (this._Index > 0) ? --this._Index : this.sorted_pictures.length - 1;
	},

	showNext: function () {
		this._Index = (this._Index < this.sorted_pictures.length - 1) ? ++this._Index : 0;
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
		var sorted_pictures = this.sorted_pictures;

	    this.$uibModal.open({
	     	templateUrl: 'templates/main/gallery-modal.html',
	     	controller: 'GalleryModalCtrl as galleryModalController',
	     	size: 'lg',
	     	resolve : {
	     		gallery: function () {
	     			return gallery
	     		},
	     		sorted_pictures: function () {
	     			return sorted_pictures;
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

	resize_font: function(size) {
		var collection = this.slug.collection;
		var el = collection == 'video' || collection == 'image'?
			document.getElementsByClassName("gallery-modal__info__picture-info")[0]:
			document.getElementsByClassName("item__article-texts")[0];

		angular.element(el).css("font-size", this.font_sizes[size] + "px");
		this.active_font = size;
	},

	get_main_pic_index: function() {
		for (var i = 0; i < this.item_data.Pictures.length; i++) {
			var pic = this.item_data.Pictures[i];
			if (pic.IsPreview == "1") {
				return i;
			}
		}
	},

	get_additional_pic_url: function() {
		for (var i = 0; i < this.item_data.Pictures.length; i++) {
			var pic = this.item_data.Pictures[i];
			if (pic.IsPreview == "0") {
				return pic.PictureUrl;
			}
		}
	},

	sort_pictures: function(data) {
		if (data.Pictures) {
			var digitized = [];
			for (var i = 0; i < data.Pictures.length; i++) {
				var pic = data.Pictures[i];
				if(pic.PictureUrl) {
					digitized.push(pic);
				}
			}
		}
		return digitized;
	},

	uc_first: function() {
		var lang = this.lang;
    	return lang.charAt(0).toUpperCase() + lang.slice(1);
    }

};

angular.module('main').controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'item',
	   'notification', 'itemTypeMap','wizard', 'header',
	   'mjs', 'recentlyViewed', '$window', '$uibModal', '$rootScope',
	   'langManager', '$timeout', '$http', '$location', 'apiClient', ItemCtrl]);