var FtreeViewController = function($scope, $state, $stateParams) {
	var self = this;

	this.$scope = $scope;
	this.$state = $state;
	this.$stateParams = $stateParams;

	if ($scope.ftreesCtrl.individuals.isNotEmpty()) {
		this.load();
	}
	$scope.$on('search-end', function() {
		self.load();
	});
};

FtreeViewController.prototype = {
	load: function() {
		if (this.$state.lastState.name !== 'ftrees' && this.$state.lastState.name !== 'ftree-view.ftree-item') {
			this.$scope.ftreesCtrl.select_individual( this.$scope.ftreesCtrl.individuals[this.$stateParams.ind_index] );
		}	
	},

	expand: function() {
		this.$state.go('ftree-item', {individual_id: this.$state.params.individual_id, tree_number: this.$state.params.tree_number});
	}
		
};

angular.module('main').controller('FtreeViewController', ['$scope', '$state', '$stateParams', FtreeViewController]);
