angular.module('main').
	factory('notification', ['langManager',function(langManager) {

	var DEFAULT_OPTIONS = {
			'className': 'info',
			globalPosition: 'top center'
		},
            pendingOptions = {
			 autoHide: false,
			 showDuration: 50
		},
		errorOptions = {
			 className: 'error',
			 showDuration: 10
		},
		warnOptions = {
			 className: 'warn'
		},
		messages = {
      500: {
      	en: 'Sorry, but the Server is down. Please try again later',
      	he: 'מצטערים, נראה שהשרת נפל. אנא נסו שנית מאוחר יותר.',
      	options: errorOptions
      }, 0: {
      	en: 'all is fine',
      	he: 'הכל אחלה',
      	options: pendingOptions
      }, 1: {
      	en: "Check your inbox for your login link",
      	he: 'הקישור לכניסה לחשבון שלכם נשלח לאימייל שלכם'
      }, 2: {
      	en: 'found some people in the family trees',
      	he: 'מצטתי אנשים בעצי המשפחהן',
      }, 3: {
      	en: "Sorry, didn't find any person",
      	he: 'מצטערים, לא נמצאו אנשים בשם זה',
      	options: errorOptions
      }, 4: {
      	en: 'Loading item...',
      	he: 'טוען פריט...',
      	options: pendingOptions
      }, 5: {
      	en: 'Sorry, failed to fetch item',
      	he: 'מצטערים, טעינת פריט נכשלה'
      }, 7: {
      	en: 'Item removed',
      	he: 'הפריט הוסר'
      }, 8: {
      	en: 'Failed to remove item',
      	he: 'הסרת הפריט נכשלה'
      }, 9: {
      	en: 'Upload in progress...',
      	he: 'העלאה מתבצעת...'
      }, 10: {
      	en: 'Sending the login email has failed, please try again later.',
      	he: 'שליחת דואל הכניסה נשלחה, אנא נסו שוב בעוד מספר רגעים',
      	options: errorOptions
      }, 11: {
      	en: 'Search has failed.',
      	he: 'החיפוש נכשל.',
      	options: errorOptions
      }, 12: {
      	en: 'We have not found a surname or a community to match your search',
      	he: 'לא מצאנו את שם המשפחה או הקהילה שחיפשתם',
      	options: {
      	  className: 'error',
      	  showDuration: 10
      	  }
      }, 13: {
      	en: 'Sorry, we failed to find a community to match your search',
      	he: 'לא מצאנו את הקהילה שחיפשתם',
      	options: warnOptions
      }, 14: {
      	en: 'Sorry, we failed to find a family name to match your search',
      	he: 'לא מצאנו את שם המפשחה שחיפשתם',
      	options: warnOptions

      }, 15: {
      	en: 'Fetching more items...',
      	he: 'אוסף עוד פריטים...',
      	options: pendingOptions

      }, 16: {
      	en: 'You must complete renaming before navigating',
      	he: 'נא להשלים את שינוי השם',
      	options: errorOptions
      }, 17: {
      	en: 'Sorry, this login link is not valid anymore',
      	he: 'מצטערים, הקישור אינו תקין',
      	options: errorOptions
      }, 18: {
      	en: 'This file type is not supported. Please upload a JPG or PNG file.',
      	he: 'שוג הקובץ הזה אינו נתמך, אנא נסו להעלות קובץ מסוג נתמך',
      	options: errorOptions
      }, 19: {
      	en: 'Something went wrong, please try uploading again',
      	he: 'משהו השתבש, אנא נסו שוב',
      	options: errorOptions
      }, 20: {
            en: "Just searched that. Please review the results.",
            he: "בדיוק חיפשתי כאלו. אנא בדוק את התוצאות.",
            options: warnOptions
      }



// next line ends the notifications dict
	  },
  	message = {
  			en: '',
  			he: ''
  	}

		var notification = {
			loading: function(on) {
        var loading_gif = angular.element('.loading');
				var view = angular.element(document.getElementById('view'));
				if (on && (loading_gif.length == 0)) {
					view.addClass('backdrop');
					jQuery('<img>')
						.addClass('loading')
						.attr('src', 'images/BH-Loading.gif')
						.appendTo('body');
				} else if (!on && (loading_gif.length > 0)) {
					view.removeClass('backdrop');
					loading_gif.remove();
				}
			},
			put: function(msg_id, code) {
				message = messages[msg_id];
				var options = angular.extend({}, DEFAULT_OPTIONS, message.options),
					text = message[langManager.lang];
                        if(code) {
                              var error_code = {'en': 'code', 'he': 'קוד'};
                              error_code = ' (' + error_code[langManager.lang] + ': '+code+')';
                              text += error_code;
                        }
				jQuery.notify(text, options);
			},

			add: function(new_message) {
				message.en += ' ' + new_message.en;
				message.he += ' ' + new_message.he;
			},

			clear: function() {
				jQuery('.notifyjs-hidable').trigger('notify-hide');
			},
		};

		return notification;
	}]);
