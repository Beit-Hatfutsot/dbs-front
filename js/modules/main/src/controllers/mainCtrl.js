var MainCtrl = function(langManager, authManager) {
    var self = this;

    Object.defineProperty(this, 'lang', {
    	get: function() {
    		return langManager.lang;
    	},

    	set: function(language) {
    		langManager.lang = language;
            window.localStorage.language= language;
    	}
    });

    Object.defineProperty(this, 'signed_in_user', {
        get: function() {
            return authManager.signed_in_user;
        }
    });
}

MainCtrl.prototype = {

}

angular.module('main').controller('MainCtrl', ['langManager', 'authManager', MainCtrl]);
