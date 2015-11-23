var GeneralSearchController = function($scope, $state, langManager, $stateParams, $http, apiClient, $modal, $q, $location, header) {
    var self = this, params = {};
    this._collection  = ($stateParams.collection !== undefined)?$stateParams.collection:'all-results';
    this.results = {hits: []};    
    this.external_results = [];
    this.$modal = $modal;
    this.$location = $location;
    this.$http = $http;
    this.apiClient = apiClient;
    header.show_search_box();
    this.header = header;
    this.$scope = $scope;
    this.external_total = '';
    this.loading = true;
    this.loading_ext = true;


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
            $state.go('general-search', {q: this.query, collection: new_collection});
        }
    });

    if ($stateParams.q !== undefined) {
        header.query = this.query = $stateParams.q;
 
        $http.get(apiClient.urls.search, {params: this.api_params()})
        .success(function (r) {  
            self.results = r.hits;
            self.loading = false;
        });

        if(this.collection == 'all-results' || this.collection == 'photoUnits,movies') {
            $http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&rows=14&start=1", {params: this.api_params_ext()})
            .success(function(r) {
                self.external_total = r.totalResults;
                self.push_ext_items(r);
                self.loading_ext = false;
            })
        }
    };
}; 
        
GeneralSearchController.prototype = {

    push_ext_items: function(r) {
        if (r.items) {
            for (var i=0; i < r.items.length; i++) {
                var item = r.items[i];
                if (item.edmPreview)
                    this.external_results.push({thumbnail: {data: item.edmPreview[0]}, UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
                else 
                    this.external_results.push({UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
            }
        }
    },

    api_params: function () {
        var params = {};
        params.q = this.header.query;
        if (this.collection != 'all-results')
            params.collection = this.collection;
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

    api_params_ext: function () {
        var params = {};
        params.query = this.header.query;

        if (this.collection == 'photoUnits,movies')
            params.qf = 'TYPE:(IMAGE OR VIDEO)';
        
        params.start = this.external_results.length;
        return params;
    }, 

    fetch_more_ext: function() {
        var query_string = this.query_string,
            self = this;

        this.$http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&rows=14", {params: this.api_params_ext()})
        .success(function (r) { self.push_ext_items(r)});

    },

    open_modal: function (collection_name) {
        var body = document.getElementsByTagName('body')[0];
        var scope = this.$scope.$new();
        scope.collection_name = this.collection;
        body.addClassName('backdrop');
        var authModalInstance = this.$modal.open({
            templateUrl: 'templates/main/allresults.html',
            size: 'm',
            scope : scope
        });
        authModalInstance.result.
        finally(function() {
            body.removeClassName('backdrop');
        });
    },
};

angular.module('main').controller('GeneralSearchController', ['$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$modal', '$q', '$location', 'header', GeneralSearchController]);
