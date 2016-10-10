var GeneralSearchController = function($rootScope, europeanaUrl, $scope, $state, langManager, $stateParams, $http, apiClient, $uibModal, $q, $location, header, $window, notification) {
    var self = this, params = {};
    this.$state = $state;
    this.$window = $window;
    this._collection  = ($stateParams.collection !== undefined)?$stateParams.collection:'allResults';
    this.results = {hits: []};
    this.eurp_results = [];
    this.cjh_results = [];
    this.$uibModal = $uibModal;
    this.$location = $location;
    this.$http = $http;
    this.apiClient = apiClient;
    this.europeanaUrl = europeanaUrl;
    header.show_search_box();
    this.header = header;
    this.$scope = $scope;
    this.eurp_total = '';
    this.cjh_total = '';
    this.loading_eurp = true;
    this.loading_cjh = true;
    this.google_query = "";
    this.langManager = langManager;
    this.notification = notification;
    this.query_words = [
        {en:'Jewish', he:'יהודי', selected: false},
        {en:'Jews', he:'יהודים', selected: false},
        {en:'Synagogue', he:'בית הכנסת', selected: false},
        {en:'Ghetto', he:'גטו', selected: false},
        {en:'Community', he:'קהילה', selected: false},
        {en:'Israel', he:'ישראל', selected: false}
    ];

    this.collection_map = {

        allResults: {
            En: 'All results',
            He: 'כל התוצאות'
        },

        places: {
            En:'Places',
            He: 'מקומות'
        },

        media: {
            En: 'Images & Videos',
            He: 'תמונות + וידאו',
            api: 'photoUnits,movies'
        },

        luminaries: {
            En: 'Luminaries',
            He: 'אישים',
            api: 'personalities'
        },

        familyNames: {
            En: 'Family names',
            He: 'שמות משפחה'
        }
    };

    Object.defineProperty(this, 'query', {
        get: function() {
            return this.query_string;
        },

        set: function(new_query) {
            this.query_string = new_query;
            this.results = {hits: []};
        }
    });

    Object.defineProperty(this, 'collection', {
        get: function() {
            return this._collection;
        },

        set: function(new_collection) {
            this._collection = new_collection;
            this.results = {hits: []};
            this.eurp_results = [];
            this.cjh_results = [];
            $state.go('general-search', {q: this.header.query, collection: new_collection});
        }
    });

    if ($stateParams.q !== undefined) {
        this.query = header.query = $stateParams.q;
        self.load();
    };

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          if (toState.name.endsWith('general-search') && fromState.name.endsWith('general-search')) {
            event.preventDefault();
             if (toParams.q !== undefined) {
                self.query = header.query = toParams.q;
            }
            $state.transitionTo(toState.name, toParams, {notify: false});
            self.load(toParams);
          }
    })
};

GeneralSearchController.prototype = {

    load: function() {
        var self = this;
        self.notification.loading(true);
        self.$http.get(self.apiClient.urls.search, {params: self.api_params()})
        .success(function (r) {
            self.results = r.hits;
            self.notification.loading(false);
        });

        if(this.collection == 'allResults' || this.collection == 'media') {
            this.search_europeana(function(r) {
                self.eurp_total = r.totalResults;
                self.push_eurp_items(r);
                self.loading_eurp = false;
            });

            self.$http.jsonp("http://67.111.179.108:8080/solr/diginew/select/?fl=title,dtype,description,fulllink,thumbnail&rows=5&wt=json&json.wrf=JSON_CALLBACK", {params: this.api_params_cjh()})
            .success(function(r) {
                self.cjh_total = r.response.numFound;
                self.push_cjh_items(r);
                self.loading_cjh = false;
            })
        }
        else {
            this.eurp_total = '';
            this.cjh_total = '';
        }
    },

    push_eurp_items: function(r) {
        if (r.items) {
            for (var i=0; i < r.items.length; i++) {
                var item = r.items[i];
                if (item.edmPreview)
                    this.eurp_results.push({thumbnail: {data: item.edmPreview[0]}, UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
                else
                    this.eurp_results.push({UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
            }
        }
    },

    push_cjh_items: function(r) {
        if (r.response.docs) {
            for (var i=0; i < r.response.docs.length; i++) {
                var item = r.response.docs[i];
                if (item.thumbnail)
                    this.cjh_results.push({thumbnail: {data: item.thumbnail}, UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]}, url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
                else
                     this.cjh_results.push({UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]}, url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
            }
        }
    },

    api_params: function () {
        var params = {};
        params.q = this.header.query;
        if (this.collection != 'allResults') {
            if (this.collection_map[this.collection].hasOwnProperty('api'))
                params.collection = this.collection_map[this.collection].api
            else
                params.collection = this.collection;
        }
        params.from_ = this.results.hits.length;
        return params;
    },

    fetch_more: function() {
        var query_string = this.query_string,
            results = this.results;

        this.$http.get(this.apiClient.urls.search, {params: this.api_params()})
        .success(function (r){
            results.hits = results.hits.concat(r.hits.hits);
        });
    },

    search_europeana: function (callback) {
        var params = {qf: 'PROVIDER:"Judaica Europeana"',
				      rows: 5};
        params.query = this.header.query;

		if (this.collection == 'media')
            params.qf += ' TYPE:(IMAGE OR VIDEO)';

        params.start = this.eurp_results.length || 1;
		this.$http.get(this.europeanaUrl, {params: params})
            .success(callback)
    },

    api_params_cjh: function () {
       var params = {};
        params.q = this.header.query;

        if (this.collection == 'media')
			params.q = params.q.concat(' dtype: Photographs');

        params.start = this.cjh_results.length;
        return params;
    },

    fetch_more_eurp: function() {
        var query_string = this.query_string,
            self = this;

		this.search_europeana(function (r) { self.push_eurp_items(r)});
    },

    fetch_more_cjh: function() {
        var query_string = this.query_string,
            self = this;
        this.$http.jsonp("http://67.111.179.108:8080/solr/diginew/select/?fl=title,dtype,description,fulllink,thumbnail&rows=5&wt=json&json.wrf=JSON_CALLBACK", {params: this.api_params_cjh()})
        .success(function (r) { self.push_cjh_items(r)});

    },

    google_search: function() {
        this.$window.open('http://google.com/?q=' + this.google_query, '_blank');
    },

    google_search_on_enter:function ($event) {
        if ($event.keyCode === 13 && this.query_string.length > 1)
            this.google_search();
    },

    toggle_selected: function(word) {
        if(!word.selected && this.google_query.length > 0) {
            word.selected = true;
            this.google_query = this.google_query + '+' + word[this.langManager.lang];
        }
        else {
            word.selected = false;
            var parsed_string = [];
            parsed_string = this.google_query.split('+');
            for(var i = 0; i < parsed_string.length; i++) {
                if (parsed_string[i] === word[this.langManager.lang]) {
                    parsed_string.splice(i, 1);
                }
            }
            this.google_query = parsed_string.join("+");
        }
    },

    read_about_center: function () {
        this.$state.go('about_center', {collection: this.collection});
    },

    goto_results: function (collection_name) {
        if (this.collection == collection_name) {
            return;
        }
        if (this.header.query !==  '') {
            this.collection = collection_name;
        }
        else {
            this.$state.go('about_center', {collection: collection_name});
        }
    }
};

angular.module('main').controller('GeneralSearchController', ['$rootScope', 'europeanaUrl', '$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$uibModal', '$q', '$location', 'header', '$window', 'notification', GeneralSearchController]);
