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
				"places": {
					'En': 'Discover the history of the Jewish community of '+
						  item.title_en+
						  '. Explore photos, family trees and more of the open databases of The Museum of the Jewish People',
				    'He': 'גלו את ההיסטוריה והתרבות של קהילת יהודי ' +item.title_he+
						  ', עצי משפחה, פירוש שמות משפחה, צילומים ועוד במאגרי המידע הפתוחים של בית התפוצות, מוזיאון העם היהודי בתל אביב'
				},

                "familyNames": {
					'En': '',
					'He': 'מקור שם משפחה ' +item.title_he+ ' – באתר בית התפוצות ניתן לאתר אילנות יוחסין, פירושים לשמות משפחה, תולדותיהן של קהילות ברחבי העולם, צילומים, תמונות, סרטים ועוד',
				}
			},

			title = {
                "places": {
					'En': 'The Jewish Community of '+ item.title_en + ' | BH Open Databases',
			    	'He': 'קהילת יהודי ' + item.title_he + ' | מאגרי מידע - בית התפוצות'
				},
                "familyNames": {
					'En': '',
			    	'He': 'מקור השם ' + item.title_he+  ' | מאגרי מידע - בית התפוצות',
				},

				'deflt': {
					'En': item.title_en + ' | BH Open Databases',
				    'He': item.title_he + ' | מאגרי מידע - בית התפוצות'
				}
			},

			keywords = {
				"places": {
					'En': 'Jewish community of ' + item.title_en + ', Jews in ' + item.title_en,
			    	'He': 'קהילת יהודי ' + item.title_he+ ', יהדות ' + item.title_he+', יהודי ' + item.title_he,
				},

				"familyNames": {
					'En': '',
					'He': 'מקור שם המשפחה ' + item.title_he+ ', מקור השם '+ item.title_he + ', ' + item.title_he,
				}
			};

		$rootScope.keywords = keywords[item.collection]?keywords[item.collection][lang]:'';
		$rootScope.title = title[item.collection]?title[item.collection][lang]:title['deflt'][lang];
		$rootScope.description = description[item.collection]?description[item.collection][lang]:'';
		// TODO: make language option 'En' & 'He' universal
		$rootScope.og_type = 'article';



		$rootScope.slug = {"He": item.slug_he, "En": item.slug_en};

		main_pic_index = this.get_main_pic_index();
		if (main_pic_index !== undefined) {
			$rootScope.og_image = this.sort_pictures()[main_pic_index];
		}
	},

	get_item: function() {
		var self = this;
		self.notification.loading(true);
		this.item.get(this.slug).
			then(function(item_data) {
				self.recentlyViewed.put(
					{Slug: {"He": item_data.slug_he, "En": item_data.slug_en},
					 header: {"He": item_data.title_he, "En": item_data.title_en},
					 thumbnail_url: item_data.main_thumbnail_image_url
					});
				self.item_data = item_data;
				self.proper_link = self.item.get_url(self.item_data);
				self.content_loaded = true;
				self.refresh_root_scope();
				self.related_data = [];
				if (self.item_data.related_documents) {
					// TODO: move this logic to pipelines, frontend should be data source agnostic
					var field_ids_order = [
						"_c6_beit_hatfutsot_bh_place_located_in",
						"_c6_beit_hatfutsot_bh_place_personality_death",
						"_c6_beit_hatfutsot_bh_base_template_related_personality",
						"_c6_beit_hatfutsot_bh_place_personality_birth"
					];
					field_ids_order.forEach(function(field_id) {
						if (
							typeof(self.item_data.related_documents[field_id]) !== "undefined"
							&& self.item_data.related_documents[field_id].length > 0
						) {
                            self.item_data.related_documents[field_id].forEach(function(doc) {
                            	self.related_data.push(doc);
							});
						}
					});
				}
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

	goto_item: function(item_data) {
		//TODO: rinse the language names
		var lang = this.lang[0].toUpperCase() + this.lang.slice(1),
			slug = item_data.Slug[lang];

		this.item.goto_slug(slug);
    },

    goto_persons: function() {
		var lang = this.lang[0].toUpperCase() + this.lang.slice(1),
			params = {};
			params.collection = 'persons';

		if (this.search_result.name.Header)
		    params.q  = this.search_result.name.Header[lang]
		else if (this.search_result.place.Header)
		    params.q = this.search_result.place.Header[lang];
    	this.$state.go('general-search', params);
	},

	showPrev: function () {
        this._Index = (this._Index > 0) ? --this._Index : this.sort_pictures().length - 1;
	},

	showNext: function () {
        this._Index = (this._Index < this.sort_pictures().length - 1) ? ++this._Index : 0;
	},

	isActive: function (index) {
        return this._Index === index;
	},

	showPhoto: function (index) {
        this._Index = index;
	},

	open_gallery: function (index) {
        var	gallery = this.item_data;

	    this.$uibModal.open({
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

	resize_font: function(size) {
		var collection = this.slug.collection;
		var el = collection == 'video' || collection == 'image'?
			document.getElementsByClassName("gallery-modal__info__picture-info")[0]:
			document.getElementsByClassName("item__article-texts")[0];

		angular.element(el).css("font-size", this.font_sizes[size] + "px");
		this.active_font = size;
	},

	get_main_pic_index: function() {
        var pictures = this.sort_pictures();
		if (pictures.length > 0) {
			return 0;
			// TODO: modify for new architecture
			//     if (pic.IsPreview == "1") {
			//         return i;
			//     }
        }
	},

	get_additional_pic_index: function() {
		var pictures = this.sort_pictures();
		if (pictures.length > 1) {
			return 1;
			// if (pic.IsPreview == "0") {
			// 	return i;
			// }
        }
	},

	get_additional_pic_url: function () {
		if (this.get_additional_pic_index() !== undefined) {
            return this.sort_pictures()[this.get_additional_pic_index()].url;
		}
	},

	get_main_pic_url: function() {
        if (this.get_main_pic_index() !== undefined) {
            return this.sort_pictures()[this.get_main_pic_index()].url;
        }
	},

	sort_pictures: function() {
		var pictures = [];
        if (typeof(this.item_data.images) !== "undefined") {
            pictures = this.item_data.images;
        }
		if (typeof(this.pictures) === "undefined" || this.pictures.length !== pictures.length) {
			this.pictures = pictures;
		}
		return this.pictures;
	},

	uc_first: function() {
		var lang = this.lang;
    	return lang.charAt(0).toUpperCase() + lang.slice(1);
    },

	hasTextContentForCurrentLang: function() {
		return this.getTextContentForCurrentLang() ? true : false;
	},

	getTextContentForCurrentLang: function() {
        var lang = this.lang.toLowerCase();
        return this.item_data["content_text_"+lang];
	}

};

angular.module('main').controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'item',
	   'notification', 'itemTypeMap','wizard', 'header',
	   'mjs', 'recentlyViewed', '$window', '$uibModal', '$rootScope',
	   'langManager', '$timeout', '$http', '$location', 'apiClient', ItemCtrl]);
