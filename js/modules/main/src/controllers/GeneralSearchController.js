var GeneralSearchController = function($scope, $state, langManager, $stateParams, $http, apiClient, $modal, $q) {
    var self = this;
    this.results = [];
    this.external_results = [];
    this.$modal = $modal;
    this.collection  = 'all-results';
    this.query_string = "";

    Object.defineProperty(this, 'search_collection', {
        get: function() {
            return this.collection;
        },

        set: function(new_collection) {
            this.collection = new_collection;
        }
    });

    Object.defineProperty(this, 'query', {
        get: function() {
            return this.query_string;
        },

        set: function(new_query) {
            this.query_string = new_query;
            self.results = [];
        }
    });

    $http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&query=cohen&start=1&rows=24&profile=standard").
        success(function(r) {
            for (var i=0;i < r.items.length;i++) {
                var item = r.items[i];
                //console.log(item.title);
                if (item.title)
                    self.external_results.push({Header:  {En: item.title}, ugc: true });
            }
        }); 

    GeneralSearchController.prototype = {

        search: function() {
            var query_string = this.query_string;
            $http.get(apiClient.urls.search, {params: {q: query_string}})
            .success(function (r){
                self.results = r.hits;
             });
        },


        open_modal: function (collection_name) {
            var body = document.getElementsByTagName('body')[0];
            var scope = $scope.$new();
            scope.collection_name = this.collection;
            body.addClassName('backdrop');
            var authModalInstance = this.$modal.open({
                templateUrl: 'templates/main/allresults.html',
                size: 'lg',
                scope : scope
            });
        },

        global_search: function() {
                   
            $http.get(apiClient.urls.search, {q: this.search_string});
            /*this.$state.go('general-search', {search_query: search_string});*/
        }
    };

}; 

angular.module('main').controller('GeneralSearchController', ['$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$modal', '$q', GeneralSearchController]);
