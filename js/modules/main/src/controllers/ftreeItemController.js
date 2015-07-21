var FtreeItemController = function($state, $stateParams, ftrees, notification, fromFtreeView) {
	this.ftrees = ftrees;
	this.notification = notification;
	this.$state = $state;
	this.individual_id = this.strip_id( $stateParams.individual_id);
	this.tree_number = parseInt($stateParams.tree_number);
	this.from_ftree_view = fromFtreeView;
	this.load();
};

FtreeItemController.prototype = {
	load: function() {
		var self = this;

		this.ftrees.search({
				individual_id: this.individual_id, 
				tree_number: this.tree_number,
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

	back: function () {
		this.$state.go(this.$state.lastState, this.$state.lastStateParams );	
	},

	print: function() {
		window.print();
	},

	strip_id: function(id) {
		if (id[0] == '@') {
			return id.replace('@', '').replace('@', '');
		}
		return id;
	},

	get_contributor_path: function() {
		return this.ftrees.get_contributor_path(this.individual);
	}
};

angular.module('main').controller('FtreeItemController', ['$state', '$stateParams', 'ftrees', 'notification', 'fromFtreeView', FtreeItemController]);
