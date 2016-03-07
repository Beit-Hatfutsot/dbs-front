var HeaderCtrl = function($rootScope, $state, $location, langManager, wizard, header, notification, auth, mjs, cache, recentlyViewed, user, item, $window) {

    this.$state = $state;
    //console.log($state.includes('general-search'));
    this.auth = auth;
    this.cache = cache;
    this.recentlyViewed = recentlyViewed;
	this.$rootScope = $rootScope;
	this.$location = $location;
	this.item = item;
	this.langManager = langManager;
    this.beta_notification_open = $window.localStorage.getItem('beta-welcome-msg') != 'dismissed';
    this.$window = $window;

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
    this.header = header;

    Object.defineProperty(this, 'mjs_count', {
        get: function() {
            if (mjs.data.$resolved && mjs.data.unassigned && this.is_signedin) {
                return mjs.data.unassigned.length;
            }
            else {
                return '';
            }
        }
    });

    Object.defineProperty(this, 'is_mjs_state', {
        get: function() {
            return $state.includes('mjs');
        }
    });

    Object.defineProperty(this, 'username', {
        get: function() {
            return user.name;
        }
    });
};

HeaderCtrl.prototype = {

    signin: function() {
        this.authenticate();
    },

    signup: function() {
        this.authenticate(true);
    },

    authenticate: function(register) {
        this.auth.authenticate({
            mandatory: false,
            register: register
        });
    },

    signout: function() {
        this.auth.signout();
        this.cache.clear();
        this.recentlyViewed.clear();
    },

    goto_state: function(state_name) {
        this.$state.go(state_name);
    },

	goto_lang: function(lang) {
		//TODO: rinse the language names
		var proper_lang = lang[0].toUpperCase() + lang.slice(1),
		    url = this.$location.url(),
			text_slug = this.$rootScope.slug;

		delete this.$state.lastState;
		this.langManager.lang = lang;
		// handle item pages
		if (text_slug)
			this.item.goto_slug(text_slug[proper_lang]);
		else {
			// handle simple pages - with no moving parts in the url
			var current = this.$state.current,
				current_is_he = current.name.indexOf('he') === 0,
				name = current.name,
				state; // the state we need to go to

			if ((lang == 'en') && current_is_he)
				name = current.name.slice(6);
			else if ((lang == 'he') && !current_is_he)
				name = 'he.he_' + current.name;
			console.log(name);
			this.$state.go(name, this.$state.params);
		}
	},

    toggle_beta_notification: function() {
        if (this.beta_notification_open) {
            this.beta_notification_open = false;
            this.$window.localStorage.setItem('beta-welcome-msg', 'dismissed');
        }
        else {
            this.beta_notification_open = true;
            this.$window.localStorage.removeItem('beta-welcome-msg');
        }
    }

};

angular.module('main').controller('HeaderCtrl', ['$rootScope', '$state', '$location', 
		  'langManager', 'wizard', 'header', 'notification', 'auth', 'mjs',
		  'cache', 'recentlyViewed', 'user', 'item', '$window', HeaderCtrl]);
