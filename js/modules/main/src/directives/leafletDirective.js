angular.module('main').directive('leaflet', [
           'leaflet', 'langManager', '$http', 'apiClient', 'item',
  function (leaflet, langManager, $http, apiClient, item) {
    return {
      template: '<div></div>',
      replace: true,
      scope: {
        previewData: '='
      },

      link: function ($scope, element, attributes) {

        $scope.$watchCollection(function(){return $scope.previewData}, function(newVal, oldVal) {
          if(Object.keys(newVal).length && newVal.geometry) {
            get_map(newVal);
          }
        });

        function get_map(data) {
          var lang = langManager.lang,
              cap_lang = lang[0].toUpperCase() + lang.slice(1),
              active_place_title = data.Header[cap_lang];


          //set map center
          var act_lat = data.geometry.coordinates[1],
              act_lng = data.geometry.coordinates[0];

          var map = L.map(element[0])
              .setView([act_lat, act_lng], 7);

          setTimeout(function() {map.invalidateSize();}, 1000);

          //add tiles
          var pngTiles = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 10,
            minZoom: 7,
            subdomains: ['a', 'b', 'c']
          }).addTo(map);

          var bounds = {};
          map.on('moveend', function () {
            bounds = map.getBounds();
            //bring places marks within display bounds
            leaflet.get_geo_places(bounds).then(function (places) {
              places.forEach(function(r) {
                if (r.geometry.coordinates) {
                  var lat = r.geometry.coordinates[1];
                      lng = r.geometry.coordinates[0];
                      title = r.Header[cap_lang],
                      type = r.PlaceTypeDesc['En'],
                      icon = eval(get_icon(type));

                  if (title !== active_place_title) {
                     marker = new L.marker([lat, lng], {icon: icon, title: title})
                        .on('click', function(e) {item.get_marker_link(r.Slug[cap_lang])})
                        .addTo(map);
                  }
                }
              })
            });
          });


          //add 'pin to start' control
          var ToStartControl = L.Control.extend({
              options: {
                  position: 'topleft',
              },

              onAdd: function (map) {
                // create custom control that centers map
                var container = L.DomUtil.create('div', 'leaflet-control-zoom leaflet-bar leaflet-control');
                container.innerHTML = '<a class="leaflet-control-zoom-in" href="#"' +
                                      ' title="Center map" style="background-image:url(/images/focus_icon.png)"'+
                                      ' role="button"></a>';
                container.onclick = function(){
                  map.panTo([act_lat, act_lng], {options: {animate:true}});
                }
                return container;
              }
          });

          map.addControl(new ToStartControl());

          //build custom markers
          var smCustomIcon = L.Icon.extend({
              options: {
                iconSize: [19.5, 27], iconAnchor: [10, 27], popupAnchor: [0, -27]
              }
          });

          var bgCustomIcon = L.Icon.extend({
              options: {
                iconSize: [26.25, 35], iconAnchor: [13, 35], popupAnchor: [0, -35]
              }
          });

          var active_icon_s = new smCustomIcon({iconUrl: '/images/active_marker.png'}),
              icon_s = new smCustomIcon({iconUrl: '/images/blue_marker.png'}),
              active_icon_b = new bgCustomIcon({iconUrl: '/images/active_marker.png'}),
              icon_b = new bgCustomIcon({iconUrl: '/images/blue_marker.png'});

          var place_type = data.PlaceTypeDesc['En'];
              active_icon = eval(get_active_icon(place_type));

          var mark = L.marker([act_lat, act_lng], {icon: active_icon, title: active_place_title})
                    .on('click', function(e) { item.get_marker_link(data.Slug[cap_lang])})
                    .addTo(map);

        };

        function get_icon (type) {
          return icon = (type == 'Town' || type == 'Village') ?
                'icon_s' : 'icon_b';
        };

        function get_active_icon (type) {
          return icon = type == 'Town' || type == 'Village' ?
                'active_icon_s' : 'active_icon_b';
        };
      }
    }
  }
]);
