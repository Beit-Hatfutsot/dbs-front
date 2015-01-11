angular.module('plumb').
	factory('plumbConnectionManager', ['$timeout', function($timeout) {
		var connection_manager = {
			connections: {},
			createConnection: function(id) {
				var connection = new Connection(id);
				this.connections[id] = connection;
				return connection;
			}
		};

		function Connection(id) {
			var self = this;

			this.root = null;
			this.nodes = [];
			jsPlumb.ready(function() {
				self.plumb = jsPlumb.getInstance({
					Container: id
				});
			});
		};

		Connection.prototype = {
			connect: function(node_count) {
				var self = this;
				this.nodes.forEach(function(node, index) {
					if (node_count === undefined || index < node_count + 1) {
						var id = node.attr('id');
						if (id) {
							self.plumb.connect({
								source: self.root, 
								target: node.attr('id'),
								paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
								connector: ['Straight'],
								anchor: 'Center'
							});
						}
					}
				});
			}
		};

		return connection_manager;
	}]);