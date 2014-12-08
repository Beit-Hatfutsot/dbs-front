angular.module('main').
	factory('header', ['$timeout', function($timeout) {
		var _sub_header_state = 'closed';

		var header = {
			get sub_header_state() {
				return _sub_header_state;
			},

			set sub_header_state(new_state) {
				var old_state = _sub_header_state;

		        if (old_state == new_state) {
		            _sub_header_state = 'closed';
		        }
		        else {
		            if (old_state == 'closed' || new_state == 'closed') {
		                _sub_header_state = new_state;
		            }
		            else {
		                $timeout(function() {
		                    _sub_header_state = new_state;
		                }, 1000);

		                _sub_header_state = '';
		            }
		        }
			}
		}

		return header
	}]);