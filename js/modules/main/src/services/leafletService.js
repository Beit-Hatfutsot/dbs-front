angular.module('main')
    .factory('leaflet', ['$q', '$http', 'apiClient', function ($q, $http, apiClient) {
        var deferred = $q.defer();

        return {
          get_geo_places: function () {
            return $http.get(apiClient.urls.geojson).then(function (resp) {
              return resp.data;
            });
          }
        }
    }
]);
