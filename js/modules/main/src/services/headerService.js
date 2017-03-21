angular.module('main').
	factory('header', [function() {
		var _sub_header_state = 'closed';

		var header = {
			is_visible: true,

			get sub_header_state() {
				return _sub_header_state;
			},

			set sub_header_state(new_state) {
				var old_state = _sub_header_state;

		        if (old_state == new_state) {
		            _sub_header_state = 'closed';
		        }
		        else {
		            window.scroll(0, 0);
		            _sub_header_state = new_state;
				}
			},

			show_search_box: function() {
				_sub_header_state = 'general-search';
			},

			show_recent: function () {
				_sub_header_state = 'recently-viewed';
			},

			query: ""
		}

		return header
	}]);
