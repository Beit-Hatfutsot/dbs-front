angular.module('main')
    .factory('leaflet', ['$q', '$http', 'apiClient', function ($q, $http, apiClient) {
        var deferred = $q.defer();

        return {
          get_geo_places: function (bounds) {
            return $http.get(apiClient.urls.geojson,
              {params:
                {'southWestLat': bounds._southWest.lat,
                'southWestLng': bounds._southWest.lng,
                'northEastLat': bounds._northEast.lat,
                 'northEastLng': bounds._northEast.lng
                }
              }).then(function (resp) {
                return resp.data;
              });

          }
        }
    }
]);
