var GeneralSearchController = function($resource, $rootScope, europeanaUrl, $scope, $state, langManager, $stateParams, $http, apiClient, $uibModal, $q, $location, header, $window, notification) {
    var self = this, params = {};
    this.$resource = $resource;
    this.search_params = {};
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this._collection = $stateParams.collection !== undefined?$stateParams.collection:'allResults';
    this.results = {hits: []};
    this.eurp_results = [];
    this.cjh_results = [];
    this.$uibModal = $uibModal;
    this.$location = $location;
    this.$http = $http;
    this.apiClient = apiClient;
    header.show_search_box();
    this.header = header;
    this.$scope = $scope;
    this.eurp_total = 0;
    this.cjh_total = 0;
    this.loading_eurp = true;
    this.loading_cjh = true;
    this.google_query = "";
    this.langManager = langManager;
    this.notification = notification;
    this.europeanaUrl = europeanaUrl;
    this.cjh_url = "http://67.111.179.108:8080/solr/diginew/select/?"+
                    "fl=title,dtype,description,fulllink,thumbnail&"+
                    "wt=json&json.wrf=JSON_CALLBACK";
    this.ext_items_per_page = 6;
    this.int_items_per_page = 15;
    this.max_size = 5;
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

        images: {
            En: 'Images',
            He: 'תמונות',
            api: 'photoUnits'
        },

        videos: {
            En: 'Videos',
            He: 'וידאו',
            api: 'movies'
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

    $scope.curr_page = $stateParams.from_ !== undefined?Math.floor($stateParams.from_/this.int_items_per_page)+1:1;
    $scope.epcurr_page = $scope.epcurr_page!== undefined?$scope.epcurr_page:1;
    $scope.cjhcurr_page = $scope.cjhcurr_page!== undefined?$scope.cjhcurr_page:1;

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
            this.cjh_total = 0;
            this.eurp_total = 0;
            $scope.curr_page = 1;
            this.$window.sessionStorage.removeItem('ep_params');
            this.$scope.epcurr_page = 1;
            this.$window.sessionStorage.removeItem('cjh_params');
            this.$scope.cjhcurr_page = 1;
            $state.go('.', {from_:0, collection: new_collection});
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
            self.load();
          }
    });
};

GeneralSearchController.prototype = {

    api_params: function () {
        var params = {};
        params.q = this.header.query;
        if (this.collection !== 'allResults') {
            if (this.collection_map[this.collection].hasOwnProperty('api'))
                params.collection = this.collection_map[this.collection].api
            else
                params.collection = this.collection;
        }
        params.from_ =  this.$scope.curr_page == 1?0:
                            (this.$scope.curr_page-1)*this.int_items_per_page+1;
        return params;
    },

    ep_params: function() {
        var params = {};
        params = {qf: 'PROVIDER:"Judaica Europeana"',
                  rows: this.ext_items_per_page};
        params.query = this.header.query;

        if (this.collection == 'images')
            params.qf += ' TYPE:IMAGE';

        if (this.collection == 'videos')
            params.qf += ' TYPE:VIDEO';
        params.start = (this.$scope.epcurr_page-1)*this.ext_items_per_page+1;
        return params;
    },

    cjh_params: function() {
        var params = {};
        params.q = this.header.query;
        params.rows = this.ext_items_per_page;
        params.start = (this.$scope.cjhcurr_page-1)*this.ext_items_per_page;
        if (this.collection == 'images') {
            params.q = params.q.concat(' dtype: Photographs');
        }
        return params;
    },

    load: function() {
        var self = this,
            params = {};
        self.notification.loading(true);
        params = this.api_params();
        this.$http.get(this.apiClient.urls.search, {params: params})
            .success(function (r) {
                self.results = r.hits;
                self.notification.loading(false);
            });

        if(self.collection == 'allResults' || self.collection == 'images' || self.collection == 'videos') {
            self.search_europeana(function(r) {
                self.loading_eurp = true;
                self.eurp_total = r.totalResults;
                self.eurp_results = self.push_eurp_items(r);
                self.loading_eurp = false;
            });
            if (self.collection !== 'videos') {
                self.search_cjh(function (r) {
                    self.loading_cjh = true;
                    self.cjh_total = r.response.numFound;
                    self.cjh_results = self.push_cjh_items(r);
                    self.loading_cjh = false;

                });
            }
        }
        else {
            self.eurp_total = 0;
            self.cjh_total = 0;
        }
    },

    search_cjh: function (callback) {
        var self = this,
            params = {};

        if (self.$window.sessionStorage.getItem('cjh_params')) {
            params = self.$window.sessionStorage.getItem('cjh_params');
            params = JSON.parse(params);
            self.$scope.cjhcurr_page = Math.floor(params.start/this.ext_items_per_page)+1;
        }
        else {
            params = self.cjh_params();
        }
        this.$http.jsonp(this.cjh_url, {params: params})
            .success(callback);
    },

    search_europeana: function (callback) {
        var self = this,
            params = {};

        if (self.$window.sessionStorage.getItem('ep_params')) {
            var params = self.$window.sessionStorage.getItem('ep_params');
            params = JSON.parse(params);
            self.$scope.epcurr_page = Math.floor(params.start/this.ext_items_per_page)+1;
        }
        else {
            params = self.ep_params();
        }
        this.$http.get(self.europeanaUrl, {params: params})
            .success(callback);
    },

    update: function(search, new_page) {
        var self = this,
            params = {};
        switch(search) {
            case 'gs_search':
                self.notification.loading(true);
                self.$scope.curr_page = new_page;
                params = self.api_params();
                this.$state.go('.', params);
                var newQuery = this.$resource(this.apiClient.urls.search);
                newQuery.get(params).$promise
                    .then(function (r) {
                        self.results = r.hits;
                        self.notification.loading(false);
                    });
                break;
            case 'ep_search':
                self.loading_eurp = true;
                self.$scope.epcurr_page = new_page;
                var params = self.ep_params();

                this.$http.get(self.europeanaUrl, {params: params})
                .success(function(r){
                    self.eurp_results = self.push_eurp_items(r);
                    self.loading_eurp = false;
                });
                self.$window.sessionStorage.setItem('ep_params', JSON.stringify(params));
                break;

            case 'cjh_search':
                self.loading_cjh = true;
                self.$scope.cjhcurr_page = new_page;
                var params = self.cjh_params();

                self.$http.jsonp(this.cjh_url, {params: params})
                    .success(function (r) {
                        self.cjh_results = self.push_cjh_items(r);
                        self.loading_cjh = false;
                    });
                self.$window.sessionStorage.setItem('cjh_params', JSON.stringify(params));
                break;
        }
    },

    push_eurp_items: function(r) {
        var eurp_results = [];
        if (r.items) {
            for (var i=0; i < r.items.length; i++) {
                var item = r.items[i];
                if (item.edmPreview){
                    eurp_results.push({thumbnail_url: item.edmPreview[0],UnitType: item.type,
                                       Header: {En: item.title[0], He: item.title[0]},
                                       url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
                }
                else
                    eurp_results.push({UnitType: item.type, Header: {En: item.title[0], He: item.title[0]},
                                       url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
            }
        }
        return eurp_results;
    },

    push_cjh_items: function(r) {
        var cjh_results = [];
        if (r.response.docs) {
            for (var i=0; i < r.response.docs.length; i++) {
                var item = r.response.docs[i];
                if (item.thumbnail)
                    cjh_results.push({thumbnail_url: item.thumbnail, UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]},
                                      url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
                else
                    cjh_results.push({UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]},
                                     url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
            }
        }
        return cjh_results;
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

angular.module('main').controller('GeneralSearchController', ['$resource', '$rootScope', 'europeanaUrl', '$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$uibModal', '$q', '$location', 'header', '$window', 'notification', GeneralSearchController]);
