var FtreeItemController = function($stateParams, ftrees, notification) {
	this.ftrees = ftrees;
	this.notification = notification;

	this.individual_id = this.strip_id( $stateParams.indi_id );
	this.tree_number = $stateParams.gtn;

	this.load();	
};

FtreeItemController.prototype = {
	load: function() {
		var self = this;

		this.ftrees.get_individual_document(this.individual_id, this.tree_number).
			then(function(individual) {
				self.ftrees.get_data(individual.GTN).
					then(function() {
						self.individual = self.ftrees.parse_individual(individual);

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