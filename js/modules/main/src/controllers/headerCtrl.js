var HeaderCtrl = function($state, wizard, header, notification, auth, mjs) {

    this.auth = auth;

	this.langauage_menu_open = false;

	this.search_placeholders = {
		'en': 'Search for communities, last names and personalities',
		'he': 'חפשו קהילות, פירושי שמות משפחה ואישים'
	};
    
    Object.defineProperty(this, 'is_signedin', {
        get: function() {
            return auth.is_signedin();
        }
    });
    
	Object.defineProperty(this, 'notification_message', {
        get: function() {
        	return notification.get();
        }
    });

	Object.defineProperty(this, 'show_notifications', {
        get: function() {
            if ( ($state.includes('start') && wizard.search_status == '' && !(wizard.in_progress) && !(wizard.failed)) || header.sub_header_state != 'closed' ) {
                return false;
            }

            return true;
        }
    });

    Object.defineProperty(this, 'sub_header_state', {
        get: function() {
            return header.sub_header_state;
        },

        set: function(new_state) {
            header.sub_header_state = new_state;
        }
    });

    Object.defineProperty(this, 'mjs_count', {
        get: function() {
            if (mjs.data.$resolved) {
                return mjs.data.unassigned.length;
            }
            else {
                return '';
            }
        }
    });
};

HeaderCtrl.prototype = {
	signout: function() {
        this.auth.signout();
    }
};

angular.module('main').controller('HeaderCtrl', ['$state', 'wizard', 'header', 'notification', 'auth', 'mjs', HeaderCtrl]);
