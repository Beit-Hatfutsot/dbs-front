angular.module('plumb').
	factory('plumbConnectionManager', ['$q', function($q) {
		var connection_manager = {
			root: null,
			nodes: [],
			connections: [],
			deferred: {
				getData: $q.defer(),
				compile: $q.defer()
			},
			connect: connect
		};

		$q.all([connection_manager.deferred.getData.promise, connection_manager.deferred.compile.promise]).then(connect);

		function connect() {
			connection_manager.nodes.forEach(function(node) {
				console.log(node.attr('id'))	
				var connection = jsPlumb.connect({
					source: connection_manager.root, 
					target: node.attr('id'),
					paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
					connector: 'Straight',
					anchor: 'Center'
				});
				
			});
		}

		return connection_manager;
	}]);