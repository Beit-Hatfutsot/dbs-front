angular.module('plumb').
	factory('plumbConnectionManager', ['$timeout', function($timeout) {
		var connection_manager = {
			root: null,
			nodes: [],
			connections: [],
			connect: function(node_count) {
				connection_manager.nodes.forEach(function(node, index) {
					if (index < node_count + 1) {
						var id = node.attr('id');
						if (id) {
							jsPlumb.connect({
								source: connection_manager.root, 
								target: node.attr('id'),
								paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
								connector: 'Straight',
								anchor: 'Center'
							});
						}
					}
				});
			}
		};

		return connection_manager;
	}]);