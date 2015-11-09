var GeneralSearchController = function($scope, $state, langManager, $stateParams, $http, apiClient, $modal) {
    var self = this;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.results = [];
    this.external_results = [];
    this.$modal = $modal;
    this.collection  = 'all-results';

    Object.defineProperty(this, 'search_collection', {
        get: function() {
            return this.collection;
        },

        set: function(new_collection) {
            this.collection = new_collection;
        }
    });

    $http.get(apiClient.urls.search+this.search_string).
        success(function (results) {
            var collection_names = ['familyNames', 'movies', 'personalities', 'photoUnits', 'places'];
            for (var i=0;i < 10; i++) {
                for (var j=0; j < 5; j++) {
                    var r = results[collection_names[j]][i];
                    
                    if (r !== undefined) {
                        self.results.push(r);
                        console.log(r);
                    }
                }
            }
        });

    $http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&query=jew&start=1&rows=24&profile=standard").
        success(function(r) {
            for (var i=0;i < r.items.length;i++) {
                var item = r.items[i];
                console.log(item.title);
                if (item.title)
                    self.external_results.push({Header:  {En: item.title[0]}, ugc: true });
            }
        });
};  

GeneralSearchController.prototype = {

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

angular.module('main').controller('GeneralSearchController', ['$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$modal', GeneralSearchController]);
