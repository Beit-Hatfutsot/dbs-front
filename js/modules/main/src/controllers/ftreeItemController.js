var FtreeItemController = function($stateParams, ftrees, notification) {
	this.ftrees = ftrees;
	this.notification = notification;

	this.individual_id = this.strip_id( $stateParams.individual_id );
	this.tree_number = parseInt($stateParams.tree_number);

	this.load();	
};

FtreeItemController.prototype = {
	load: function() {
		var self = this;

		this.ftrees.search({
				individual_id: this.individual_id, 
				tree_number: this.tree_number
			}).
			then(function(individuals) {
				self.ftrees.get_data(individuals[0].GTN).
					then(function() {
						self.individual = self.ftrees.parse_individual(individuals[0]);

						self.notification.put({
							en: 'Family tree successfully loaded.',
							he: 'עץ משפחה נטען בהצלחה.'
						});
					}, function() {
						self.notification.put({
							en: 'Failed to load tree.',
							he: 'טעינת עץ נכשלה.'
						});
					});
			});
	},

	strip_id: function(id) {
		if (id[0] == '@') {
			return id.replace('@', '').replace('@', '');
		}

		return id;
	}
};

angular.module('main').controller('FtreeItemController', ['$stateParams', 'ftrees', 'notification', FtreeItemController]);