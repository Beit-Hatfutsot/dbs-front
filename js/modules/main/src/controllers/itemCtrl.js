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

	this.get_item();

	$rootScope.$on("item_data-loaded", function(event, data) {
		if (data.geometry) {
			self.render_map(data);
		}
	});

	$rootScope.$on('$stateChangeStart',
	    function(event, toState, toParams, fromState, fromParams){

	      if (fromState.name.endsWith('item-view') && fromParams.collection == 'video') {
	      	var video_element = angular.element(document.querySelector('.item__content__media-container')).find("video")[0];
			video_element.pause();
	      }
	});

	if(this.$window.sessionStorage.wizard_result) {
		this.search_result = JSON.parse(this.$window.sessionStorage.wizard_result);
	}

	/*
	var unwatch_item_load = $rootScope.$on('item-loaded', function(event, item) {
		unwatch_item_load();
	});
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

	render_map: function (data) {
		var self = this;
		var place_name = data.Header[self.proper_lang];
		var coordinates = [],
			mymap;
		if (mymap != undefined) { mymap.remove(); }

		var mymap = L.map('mapid').setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 10);

		this.$timeout(function () {
		    mymap.invalidateSize();
		}, 0);

		var smCustomIcon = L.Icon.extend({
			options: {
				iconSize: [19.5, 27], iconAnchor: [10, 27], popupAnchor: [0, -27]
			}
		});

		var bgCustomIcon = L.Icon.extend({
			options: {
				iconSize: [26.25, 35], iconAnchor: [13, 35], popupAnchor: [0, -35]
			}
		});

		var	active_icon_s = new smCustomIcon({iconUrl: '/images/active_marker.png'}),
			icon_s = new smCustomIcon({iconUrl: '/images/marker.png'}),
			active_icon_b = new bgCustomIcon({iconUrl: '/images/active_marker.png'}),
			icon_b = new bgCustomIcon({iconUrl: '/images/marker.png'});

		L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
		  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		  maxZoom: 10,
		  minZoom:7,
		  subdomains: ['a', 'b', 'c']
		}).addTo(mymap);


		var lat = data.geometry.coordinates[1];
		var lng = data.geometry.coordinates[0];
		var title = data.Header[self.proper_lang];

		if (data.PlaceTypeDesc['En'] == 'Town' || data.PlaceTypeDesc['En'] == 'Village') {
			var mark = L.marker([lat, lng], {icon: active_icon_s}).bindPopup('<a href="' + self.get_item_url(data.Slug) + '" target="_self">'+title+'</a>').addTo(mymap);
		}
		else {
			var mark = L.marker([lat, lng], {icon: active_icon_b}).bindPopup('<a href="' + self.get_item_url(data.Slug) + '" target="_self">'+title+'</a>').addTo(mymap);
		};

		this.$http.get(this.apiClient.urls.geojson).success(function(places){
			places.forEach(function(r){
				if (r.geometry.coordinates) {
					var lat = r.geometry.coordinates[1];
					var lng = r.geometry.coordinates[0];
					var title = r.Header[self.proper_lang];

					if (title !== place_name) {
						if (r.PlaceTypeDesc['En'] == 'Town' || r.PlaceTypeDesc['En'] == 'Village') {
							marker = new L.marker([lat, lng], {icon: icon_s})
								.bindPopup('<a href="' + self.get_item_url(r.Slug) + '" target="_self">'+title+'</a>')
								.addTo(mymap);

						}
						else {
							marker = new L.marker([lat, lng], {icon: icon_b})
								.bindPopup('<a href="' + self.get_item_url(r.Slug) + '" target="_self">'+title+'</a>')
								.addTo(mymap);
						}
					}

				}
			})
		});
	},


    get_item_url: function(slug) {
    	var self = this;
    		state = this.lang == 'he'? 'he.he_item-view': 'item-view';
			var parts = slug[self.proper_lang].split('_'),
				params = {collection: parts[0],
						  local_slug : parts[1]};
	    return this.$state.href(state, params);
	},

	refresh_root_scope: function() {
		var item = this.item_data,
			$rootScope = this.$rootScope,
			main_pic_index = this.get_main_pic_index();
		// TODO: make language option 'En' & 'He' universal
		var language_map = {'en': 'En', 'he': 'He'},
			lang = language_map[$rootScope.lang];
		$rootScope.title = item.Header[lang];
		$rootScope.og_type = 'article';
		if (item.UnitText1[lang]) {
			var description_sentences = item.UnitText1[lang].split('.')
			if (description_sentences.length > 3)
				$rootScope.description = description_sentences.slice(0,3).join('. ')+'...';
			else
				$rootScope.description = item.UnitText1[lang];
		}
		$rootScope.slug = item.Slug;
		if (main_pic_index !== undefined) {
			$rootScope.og_image = "https://storage.googleapis.com/bhs-flat-pics/" + item.Pictures[main_pic_index].PictureId + ".jpg";
		}
	},

	get_item: function() {
		var self = this;
		self.notification.loading(true);
		this.item.get(this.slug).
			then(function(item_data) {
				if(item_data.UnitType == '5') {
					self.$rootScope.$broadcast('item_data-loaded', item_data);
				}
				self.recentlyViewed.put(
					{Slug: item_data.Slug,
					 header: item_data.Header,
					 thumbnail_url: item_data.thumbnail_url
					});
				self.item_data = item_data;
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
				self.notification.put(5);
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
	},

	sort_pictures: function() {
		if (this.item_data.Pictures) {
			var digitized = [],
			nondigitized = [];
		for (var i = 0; i < this.item_data.Pictures.length; i++) {
			var pic = this.item_data.Pictures[i];
			if(pic.PictureId !== '') {
				digitized.push(pic);
			}
			else {
				nondigitized.push(pic);
			}
		}
		digitized.push.apply(digitized, nondigitized);
		return digitized;
		}
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
