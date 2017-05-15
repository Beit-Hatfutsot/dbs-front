var GeneralSearchController = function($rootScope, europeanaUrl, $scope, $state, langManager, $stateParams, $http, apiClient, $uibModal, $q, $location, header, $window, notification) {
    var self = this, params = {};
    var advanced_fields = ['pob', 'pom', 'pom', 'pob_t', 'pom_t', 'pom_t','treenum', 'yob', 'yom','yod',
                           'yob_t', 'yom_t', 'yod_t', 'yob_v', 'yom_v', 'yod_v'];
    this.$state = $state;
    this.$stateParams = $stateParams;
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
    this.eurp_total = 0;
    this.cjh_total = 0;
    this.loading_eurp = true;
    this.loading_cjh = true;
    this.google_query = "";
    this.langManager = langManager;
    this.lang = langManager.lang;
    this.notification = notification;
    this.query_words = [
        {en:'Jewish', he:'יהודי', selected: false},
        {en:'Jews', he:'יהודים', selected: false},
        {en:'Synagogue', he:'בית הכנסת', selected: false},
        {en:'Ghetto', he:'גטו', selected: false},
        {en:'Community', he:'קהילה', selected: false},
        {en:'Israel', he:'ישראל', selected: false}
    ];

    this.search_modifiers  = {
        first_t: '',
        last_t: '',
        pob_t:  '',
        pom_t:  '',
        pod_t:  '',
        sex:    '',
        yom_v:  '',
        yob_v:  '',
        yod_v:  '',
        yom_t:  '',
        yob_t:  '',
        yod_t:  '',
        treenum: ''
    };

    this.persons_parameters  = {
        first: '',
        first_t: '',
        last: '',
        last_t: '',
        pob: '',
        pom: '',
        pod: '',
        pob_t:  '',
        pom_t:  '',
        pod_t:  '',
        sex:    '',
        yob: '',
        yom: '',
        yod: '',
        yom_v:  '',
        yob_v:  '',
        yod_v:  '',
        yom_t:  '',
        yob_t:  '',
        yod_t:  '',
        treenum: ''
    };

    this.search_params = {};

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
        },

        persons: {
            En: 'People (Family Trees)',
            He: 'אנשים (עצי משפחה)'
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
            this.cjh_total = 0;
            this.eurp_total = 0;
            if (new_collection !== "persons") {
                /*this.clear_filters();*/
                 $state.transitionTo('general-search', {q: this.header.query, collection: new_collection});
            }
            $state.go('general-search', {q: this.header.query, collection: new_collection});
        }
    });

    if ($stateParams.q !== undefined) {
        this.query = header.query = $stateParams.q;
        self.load();
    };

    /*$rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          if (toState.name.endsWith('general-search') && fromState.name.endsWith('general-search')) {
            event.preventDefault();
             if (toParams.q !== undefined) {
                self.query = header.query = toParams.q;
            }
            $state.transitionTo(toState.name, toParams, {notify: false});
            self.load(toParams);
          }
    })*/
};

GeneralSearchController.prototype = {

    clear_filters: function() {
        for (var persons_param in this.persons_parameters) {
            this.search_params[persons_param] = '';
            this.$location.search(persons_param, null);
        }
    },

    handle_search_modifiers: function(search_params) {
        var base;
        for (var modifier in this.search_modifiers) {
            if (modifier in search_params) {
                base = modifier.split('_')[0];
                if (search_params[base] == undefined || search_params[base] == '') {
                    delete this.search_params[modifier];
                }
            }
        }
    },

    toggle_more: function() {
        var param = this.$stateParams;
        if (param.more == '0' || param.more == undefined) {
            param.more = '1';
            /*if(this.search_params.place) {
                this.search_params.birth_place = this.search_params.place;
                this.search_params.place = '';
            }*/
        }
        else {
            param.more = '0';
            /*if(this.search_params.birth_place) {
                this.search_params.place = this.search_params.birth_place;
                this.search_params.birth_place = '';
            }*/
        }
        this.$location.search(param);
    },

    update: function() {
        var self = this;
        //get search params (fileds content) and filter them
        var search_params = angular.copy(this.search_params);
        for (var param in search_params) {
            if (search_params[param] === '' || search_params[param] == undefined) {
                delete search_params[param];
            }
        }
        this.handle_search_modifiers(search_params);
        search_params = this.search_params;
        search_params.more = this.$stateParams.more;

       // search_params.more = this.$stateParams.more;
        /*var prev_search = this.$window.sessionStorage.getItem('ftrees_search_params');
        if (JSON.stringify(search_params) === prev_search) {
            self.notification.put(20);
        }*/
        this.$state.go('general-search', search_params, {inherit: false});
        //this.$window.sessionStorage.setItem('ftrees_search_params', JSON.stringify(search_params));
    },


    search: function(par) {
        var self = this;
        this.$state.go('general-search', {params: par});
        self.$http.get(self.apiClient.urls.search, {params: par})
        .success(function (r) {
            self.results = r.hits;
            self.notification.loading(false);
        });
    },

    load: function() {
        var self = this;
        self.notification.loading(true);
        self.$http.get(self.apiClient.urls.search, {params: self.api_params()})
        .success(function (r) {
            self.results = r.hits;
            self.notification.loading(false);
        });

        if(this.collection == 'allResults' || this.collection == 'images' || this.collection == 'videos') {
            self.search_europeana(function(r) {
                self.eurp_total = r.totalResults;
                self.eurp_results = self.push_eurp_items(r);
                self.loading_eurp = false;
            });

            if (this.collection !== 'videos') {
                self.search_cjh(function(r) {
                    self.cjh_total = r.response.numFound;
                    self.cjh_results = self.push_cjh_items(r);
                    self.loading_cjh = false;
                })
            }
        }
        else {
            this.eurp_total = 0;
            this.cjh_total = 0;
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
            if (this.collection == 'persons') {
                for (var key in this.$stateParams) {
                    if (this.$stateParams[key] && key !== 'more') {
                        var val = this.$stateParams[key];
                        params[key] = val;

                    }
                }
                this.search_params = params;
            }
        }
        params.from_ = this.results.hits.length;
        return params;
    },

    search_europeana: function (callback) {
        var params = {};
        params = {qf: 'PROVIDER:"Judaica Europeana"',
                      rows: 5};
        params.query = this.header.query;

        if (this.collection == 'images')
            params.qf += ' TYPE:IMAGE';

        if (this.collection == 'videos')
            params.qf += ' TYPE:VIDEO';

        params.start = this.eurp_results.length+1 || 1;
        this.$http.get(this.europeanaUrl, {params: params})
            .success(callback)
    },

    search_cjh: function (callback) {
        var params = {};
        params.q = this.header.query;
        if (this.collection == 'images')
            params.q = params.q.concat(' dtype: Photographs');
        params.start = this.cjh_results.length || 0;
        this.$http.jsonp("http://67.111.179.108:8080/solr/diginew/select/?fl=title,dtype,description,fulllink,thumbnail&rows=5&wt=json&json.wrf=JSON_CALLBACK", {params: params})
            .success(callback)

    },

    push_eurp_items: function(r) {
        var eurp_results = [];
        if (r.items) {
            for (var i=0; i < r.items.length; i++) {
                var item = r.items[i];
                if (item.edmPreview){
                    eurp_results.push({thumbnail_url: item.edmPreview[0], UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
                }
                else
                    eurp_results.push({UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
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
                    cjh_results.push({thumbnail_url: item.thumbnail, UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]}, url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
                else
                    cjh_results.push({UnitType: item.dtype, Header: {En: item.title[0], He: item.title[0]}, url: item.fulllink, UnitText1: {En: item.description[0], He: item.description[0]}});
            }
        }
        return cjh_results;

    },


    fetch_more: function() {
        var self = this;
        var query_string = this.query_string,
            results = this.results;

        this.$http.get(this.apiClient.urls.search, {params: this.api_params()})
        .success(function (r){
            results.hits = results.hits.concat(r.hits.hits);
        });
    },

    fetch_more_eurp: function() {
        var query_string = this.query_string,
            self = this;

        this.search_europeana(function (r) {
            self.eurp_results = self.eurp_results.concat(self.push_eurp_items(r));
        });
    },

    fetch_more_cjh: function() {
        var query_string = this.query_string,
            self = this;

        this.search_cjh(function(r) {
            self.cjh_results = self.cjh_results.concat(self.push_cjh_items(r));
        });
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
