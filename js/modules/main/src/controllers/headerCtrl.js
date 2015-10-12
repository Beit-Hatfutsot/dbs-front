var HeaderCtrl = function($state, wizard, header, notification, auth, mjs, cache, recentlyViewed, user) {

    this.$state = $state;
    this.auth = auth;
    this.cache = cache;
    this.recentlyViewed = recentlyViewed;
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

    //this.top_menu();
};

HeaderCtrl.prototype = {

    /*top_menu : function() {
        $('nav.menu ul.nav > li').each(function() {
            var li_width            = $(this).width(),
                item_before         = $(this).children('.item-before');

            item_before.css('border-left-width', li_width/2);
            item_before.css('border-right-width', li_width/2);
            item_before.removeClass('disable');
        });
    },*/

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
    }
};

angular.module('main').controller('HeaderCtrl', ['$state', 'wizard', 'header', 'notification', 'auth', 'mjs', 'cache', 'recentlyViewed', 'user', HeaderCtrl]);
