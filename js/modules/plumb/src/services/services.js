angular.module('plumb').
	factory('plumbConnectionManager', ['$timeout', function($timeout) {
		var connection_manager = {
			connections: {},
			
			createConnection: function(connection_id, container_id) {
				var connection = new Connection(container_id);
				this.connections[connection_id] = connection;
				return connection;
			},

			repaintAll: function() {
				angular.forEach(this.connections, function(connection) {
					connection.plumb.repaintEverything();
				});
			}
		};

		function Connection(container_id) {
			var self = this;

			this.root = null;
			this.nodes = [];
			jsPlumb.ready(function() {
				self.plumb = jsPlumb.getInstance({
					Container: container_id
				});
			});
		};

		Connection.prototype = {
			connect: function(node_count) {
				var self = this;
				this.nodes.forEach(function(node_id, index) {
					if (node_count === undefined || index < node_count + 1) {
						console.log(self.root + ' ' + node_id);
						if (node_id) {
							self.plumb.connect({
								source: self.root, 
								target: node_id,
								paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
								connector: ['Straight'],
								anchor: 'Center'
							});
						}
					}
				});
			},

			connect_node: function(node_id) {
				var self = this;

				self.plumb.connect({
					source: self.root,
					target: node_id,
					paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
					connector: ['Straight'],
					anchor: 'Center'
				});
			}
		};

		return connection_manager;
	}]);

angular.module('main').
	factory('plumbConnectionManager2', [function() {
		var connection_manager = {
			container: "molecules",
			connections: {},
			active_connections: {},
			plumb: jsPlumb.getInstance(),

			registerConnection: function(connection_id, connection_params) {
				if ( !this.connections.hasOwnProperty(connection_id) ) {
					this.connections[connection_id] = connection_params;
				}
			},

			connect: function(connection_id) {
				var connection_params = this.connections[connection_id],
					connection = this.plumb.connect(connection_params);
				this.active_connections[connection_id] = connection;

				return connection;
			},

			repaint: function(connection_id) {
				this.plumb.repaint(this.active_connections[connection_id]);
			},

			detach: function(connection_id) {
				this.plumb.detach(this.active_connections[connection_id]);
			},

			active_connection: function(connection_id) {
				return this.active_connections.hasOwnProperty(connection_id);
			}
		}

		return connection_manager;
	}]);