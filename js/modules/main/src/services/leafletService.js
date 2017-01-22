angular.module('main')
    .factory('leaflet', ['$q', '$http', 'apiClient', function ($q, $http, apiClient) {
        var deferred = $q.defer();

        return {
          get_geo_places: function (bounds) {
            return $http.get(apiClient.urls.geojson,
              {params:
                {'sw_lat': bounds._southWest.lat,
                 'sw_lng': bounds._southWest.lng,
                 'ne_lat': bounds._northEast.lat,
                 'ne_lng': bounds._northEast.lng
                }
              }).then(function (resp) {
                return resp.data;
              });

          }
        }
    }
]);
