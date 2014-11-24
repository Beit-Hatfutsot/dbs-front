angular.module('main').
	factory('notification', function(langManager) {
		var message = {
			en: '',
			he: ''
		}

		var notification = {
			put: function(new_message) {
				message = new_message;
			},

			add: function(new_message) {
				message.en += ' ' + new_message.en;
				message.he += ' ' + new_message.he;
			},

			clear: function() {
				message = {
					en: '',
					he: ''					
				};
			},

			get: function() {
				return message[langManager.lang];
			}
		};

		return notification;
	});