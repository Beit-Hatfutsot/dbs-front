var HeaderCtrl = function() {

	this.search_placeholders = {
		'en': 'Search for communities, last names and personalities',
		'he': 'חפשו קהילות, פירושי שמות משפחה ואישים'
	};
};

HeaderCtrl.prototype = {

};

angular.module('main').controller('HeaderCtrl', [HeaderCtrl]);
