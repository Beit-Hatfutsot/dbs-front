
angular.module('main').
	factory('item', ['$resource', '$q', '$rootScope', 'apiClient', 'cache', 'itemTypeMap', '$state',
	function($resource, $q, $rootScope, apiClient, cache, itemTypeMap, $state) {

		var collection_type_map = {
			0: 'genTreeIndividuals',
			1: 'photoUnits',
			5: 'places',
			6: 'familyNames',
			8: 'personalities',
			9: 'movies',
			'IMAGE': 'photoUnits',
			'VIDEO': 'movies',
			'TEXT': 'text',
			'SOUND': 'audio',
			'3D': '3D',
			'Photographs' : 'photoUnits',
			'Photograph albums' : 'photoUnits',
			'Photographic portraits' : 'photoUnits',
			'Manuscripts': 'text'},
			 slug_collection_map = {
			  "image": "photoUnits",
			  "תמונה": "photoUnits",
			  "synonym": "synonyms",
			  "שם נרדף": "synonyms",
			  "lexicon": "lexicon",
			  "מלון": "lexicon",
			  "luminary": "personalities",
			  "אישיות": "personalities",
			  "place": "places",
			  "מקום": "places",
			  "person": "genTreeIndividuals",
			  "אדם": "genTreeIndividuals",
			  "familyname": "familyNames",
			  "שםמשפחה": "familyNames",
			  "video": "movies",
			  "וידאו": "movies"};
		var in_progress = false;

		var itemResource = $resource(apiClient.urls.item +'/:slugs');

		var item_service = {

			parse_state: function(state) {
				var ret =  {collection: state.collection,
							local_slug: state.local_slug}
				ret.item_type = slug_collection_map[ret.collection];
				ret.api = [ret.collection, ret.local_slug].join('_');
				ret.full = [ret.collection, ret.local_slug].join('/');
				return ret;

			},

			goto_slug: function(api_slug) {
				var sep = api_slug.indexOf('_'),
					params = {collection: api_slug.slice(0, sep),
							  local_slug: api_slug.slice(sep+1)},
					first = params.collection[0],
					state;
				if ((first >= 'a') && (first <= 'z'))
					state = 'item-view';
				else
					state = 'he.he_item-view';
				$state.go(state, params);
			},

			get_key: function(item_data) {
				if (item_data.Slug)
					return item_data.Slug.En || item_data.Slug.He;
				if (item_data.params)
					return JSON.stringify(item_data.params)
			},

			get_url: function (item_data) {
				/*
				if ((item_data.url !== undefined) && (item_data.url !== null)) {
					return item_data.url;
				}
				/* TODO: restore the family trees
				if (item_data.params && item_data.params.hasOwnProperty('tree_number')) {
					return $state.href('ftree-view',
									   	{individual_id: item_data.params.node_id,
										 tree_number: item_data.params.tree_number});
				}
				else {
					return $state.href('item-view', item_data.slug.full);
				}
				*/

			    var lang = $rootScope.lang,
					proper_lang = lang[0].toUpperCase() + lang.slice(1),
					params,
					state;
				//get url with another language if the item's description in current is missing
				if (item_data.UnitText1 && (item_data.UnitText1[proper_lang] == null || item_data.UnitText1[proper_lang] == '')) {
				proper_lang == 'En' ? proper_lang = 'He' : proper_lang = 'En';
				lang = proper_lang.toLowerCase();
				}

				//TODO: try and remove the next 3 lines as url should be based
				// on current language
				if (item_data.slug) {
					state = 'item-view';
					params = {collection: item_data.slug.collection,
							  local_slug : item_data.slug.local_slug};
				}
				else if (item_data.Slug) {
					state = 'item-view';
					var parts = item_data.Slug[proper_lang].split('_'),
					params = {collection: parts[0],
							  local_slug : parts[1]};
				}
				else {
					state = item_data.state;
					params = item_data.params;
				}
				if (lang == 'he')
					state = 'he.he_'+state;

				return $state.href(state, params);

			},

			get_data_string: function(item_data) {
				return itemTypeMap.get_item_string(item_data);
			},
			get_type: function (item_data) {
				return collection_type_map[item_data.UnitType];
			},

			get: function(some_slug) {
				if ( !in_progress ) {
					var self 				= this,
						deferred			= $q.defer(),
						slug,
						cached				= {}; // cache.get(slug);

					slug = angular.isString(some_slug)? some_slug : some_slug.api;

					if (cached.isNotEmpty()) {
						$rootScope.$broadcast('item-loaded', cached);
						deferred.resolve(cached);
					}
					else {
						try {
							itemResource.query({slugs: slug}).$promise
								.then(function(item_data) {
									// cache.put(item_data[0], slug);
									$rootScope.$broadcast('item-loaded', item_data[0]);
									deferred.resolve(item_data[0]);
								},
								function(error) {
									deferred.reject(error);
								}).
								finally(function() {
									in_progress = false;
								});
						}
						catch(e) {
							deferred.reject();
						}
					}

					return deferred.promise;
				}
			},

			check_person_slug: function (slugs) {
				slugs.forEach (function (slug, i) {
					if (slug.indexOf('person') == 0) {
						var str = slug.split('.');
						if (str[0].indexOf(';') == -1 ) {
							str[0] += ';0.';
							slugs[i] = str[0] + str[1];
						}
					}

				});
				return slugs;
			},

			get_items: function(slugs) {
				if ( !in_progress ) {
					var self 				= this,
						deferred			= $q.defer(),
						cached_items		= [],
						not_cached_slugs	= [];

					slugs.forEach(function(slug) {
						if(!slug) return;
						var cached 				= {}; // cache.get(item_id, collection_name);

						if (cached.isNotEmpty()) {
							cached_items.push(cached);
						}
						else {
							not_cached_slugs.push(slug);
						}
					});

					if (not_cached_slugs.isEmpty()) {
						$rootScope.$broadcast('item-loaded', cached_items);
						deferred.resolve(cached_items);
					}
					else {
						try {
							// fetch the non-cached items
							// TODO: store items on the cache
							self.check_person_slug (not_cached_slugs);
							not_cached_slugs = not_cached_slugs.join(',');
							itemResource.query({slugs: not_cached_slugs}).$promise.
								then(function(item_data_arr) {
									/*
									item_data_arr.forEach(function(item_data) {
										var collection_name = itemTypeMap.get_collection_name(item_data);
										cache.put(item_data, collection_name);
									});
									*/
									var ret = item_data_arr.concat(cached_items);
									$rootScope.$broadcast('item-loaded', ret);
									deferred.resolve(ret);
								},
								function() {
									deferred.resolve( cached_items );
									$rootScope.$broadcast('items-load');
								}).
								finally(function() {
									in_progress = false;
								});
						}
						catch(e) {
							deferred.reject();
						}
					}

					return deferred.promise;
				}
			}
		};

		return item_service;
	}]);
