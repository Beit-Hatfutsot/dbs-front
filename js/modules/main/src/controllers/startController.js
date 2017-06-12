/**
 * @ngdoc object
 * @name main.controller:StartController
 *
 * @description
 * The Home page controller.
 */
var StartController = function($rootScope, $scope, langManager, $state, wizard, item) {
	var self = this;
	this.lang = $scope.lang.charAt(0).toUpperCase()+$scope.lang.charAt(1);
	this.wizard = wizard;

	/**
	 * @ngdoc property
	 * @name StartController#in_progress
	 *
	 * @description
	 * Indicates that the wizard service is busy
	 *
	 * @returns {boolean} wizard busy/not busy
	 */
	Object.defineProperty(this, 'in_progress', {
		get: function() {
			return wizard.in_progress;
		}
	});

	// see doc for wizard-search-end event
	$scope.$on('wizard-search-end', function() {
		var slug_text = self.choose_result();

		if (slug_text) {
			item.goto_slug(slug_text);
		}
		else {
			var params = {};
			params.collection = 'persons';
			if (self.wizard.last_search.name != '')
				params.q = self.wizard.last_search.name;
			else {
				if (self.wizard.last_search.place != '' ) {
					params.q = self.wizard.last_search.place;
				}
			}
			$state.go('general-search', params);
		}
	});
	$rootScope.title = langManager.lang == 'en'?'Databases: Images, Name Meanings, Family Trees, Communities | BH':'מאגרים: תמונות, פירוש שם, אילן יוחסין, קהילות | בית התפוצות';
	$rootScope.description = langManager.lang=='en'?'Search archives of images & videos, last names, family trees, Jewish communities, luminaries & more via the free, open databases of The Museum of The Jewish People':'ארכיון תמונות ווידאו, פירוש שמות משפחה,'+
												' אילן יוחסין, עצי משפחה, קהילות יהודיות בעולם, אישים ועוד.'+
												' מאגרי המידע הפתוחים של מוזיאון העם היהודי - בית התפוצות';
	$rootScope.keywords = langManager.lang == 'en'?'':'פירוש שמות משפחה, אילן יוחסין, עצי משפחה, קהילות יהודיות';
};

StartController.prototype = {

	/**
	 * @ngdoc method
	 * @name StartController#choose_result
	 *
	 * @description
	 * Chooses result from wizard results (name/place/ftrees),
	 * according to specified logic (e.g choose name over place if result contains both).
	 * This method taps into the wizard search result, bypassing the wizard search status,
	 * which is something worth considering changing.
	 *
	 * @returns {String} Formatted item string for the selcted item (collection_name._id)
	 */
	choose_result: function() {
		var name = this.wizard.result.name,
			place = this.wizard.result.place;

		if ( name.isNotEmpty() ) {
			return name.Slug[this.lang];
		}
		else if ( place.isNotEmpty() ) {
			return place.Slug[this.lang];
		}
		else {
			return null
		}
	}
}

angular.module('main').controller('StartController', ['$rootScope', '$scope', 'langManager', '$state', 'wizard', 'item',StartController]);
