angular.module('main').
	factory('notification', function(langManager) {

	var dotdotdotOptions = {
			 autoHide: false,
			 showDuration: 10
		},
		errorOptions = {
			 className: 'error',
			 showDuration: 10
		},
		messages = [
			{ // 0,
			en: 'all is fine',
			he: 'הכל אחלה',
			options: dotdotdotOptions
			}, { // 1
			en:'Searching family trees...',
			he: 'מחפש בעצי משפחה...',
			elm: '#search',
			options: dotdotdotOptions
			}, { // 2
			en: 'found some people in the family trees',
			he: 'מצטתי אנשים בעצי המשפחהן',
			elm: '#search'
			}, { // 3
			en: 'Family Trees Search has failed.',
			he: 'חיפוש בעצי משפחה נכשל.',
			elm: '#search'
			}, { // 4
			en: 'Loading item...',
			he: 'טוען פריט...',
			options: dotdotdotOptions
			}, { // 5
			en: 'Sorry, failed to fetch item.',
			he: 'מצטערת, טעינת פריט נכשלה.'
			}, { // 6
			en: 'Loding Story...',
			he: 'טוען את הסיפור...'
			}, { // 7
			en: 'Item removed',
			he: 'הפריט הוסר'
			}, { // 8
			en: 'Failed to remove item',
			he: 'הסרת הפריט נכשלה'
			}, { // 9
			en: 'Upload in progress...',
			he: 'העלאה מתבצעת...'
			},{ // 10
			en: 'Searching...',
			he: 'מחפש...',
			options: dotdotdotOptions
			}, { // 11
			en: 'Search has failed.',
			he: 'החיפוש נכשל.',
			options: errorOptions
			}, { // 12
			en: 'We have not found a surname or a community to match your search.',
			he: 'לא מצאנו את שם המשפחה או הקהילה שחיפשתם.',
			options: {
			 className: 'error',
			 autoHide: false,
			 showDuration: 10
			}
		},
		{ // 13
			en: 'Sorry, we failed to find a community to match your search.',
			he: 'לא מצאנו את הקהילה שחיפשתם.'
		},
		{ // 14
			en: 'We have not found a surname to match your search.',
			he: 'לא מצאנו את שם המפשחה שחיפשתם.'
		}
	],
		DEFAULT_OPTIONS = {'className': 'info', globalPosition: 'top center'};
		var message = {
			en: '',
			he: ''
		}

		var notification = {
			put: function(msg_id) {
				message = messages[msg_id];
				var options = angular.extend({}, DEFAULT_OPTIONS, message.options);
				jQuery.notify(this.get(), options);
			},

			add: function(new_message) {
				message.en += ' ' + new_message.en;
				message.he += ' ' + new_message.he;
			},

			clear: function() {
				jQuery('.notifyjs-wrapper').trigger('notify-hide');
			},

			get: function() {
				return message[langManager.lang];
			}
		};

		return notification;
	});
