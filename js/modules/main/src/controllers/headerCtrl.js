var HeaderCtrl = function(notification) {

	this.langauage_menu_open = false;

	this.search_placeholders = {
		'en': 'Search for communities, last names and personalities',
		'he': 'חפשו קהילות, פירושי שמות משפחה ואישים'
	};

	 Object.defineProperty(this, 'notification_message', {
        get: function() {
        	return notification.get();
        }
    });
};

HeaderCtrl.prototype = {
	
};

angular.module('main').controller('HeaderCtrl', ['notification', HeaderCtrl]);
