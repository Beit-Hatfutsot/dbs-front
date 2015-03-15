var FtreeViewController = function($scope, $stateParams) {
	var self = this;

	this.$scope = $scope;
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
		this.$scope.ftreesCtrl.select_individual( this.$scope.ftreesCtrl.individuals[this.$stateParams.ind_index] );
		if (this.$stateParams.individual_id && this.$stateParams.tree_number) {
			this.$state.go('ftree-view.ftree-item', {
				individual_id: this.$stateParams.individual_id, 
				tree_number: this.$stateParams.tree_number
			});
		}	
	}
};

angular.module('main').controller('FtreeViewController', ['$scope', '$stateParams', FtreeViewController]);
