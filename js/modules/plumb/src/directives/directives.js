angular.module('plumb').

	directive('plumbContainer', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			    var id = element.attr('id');
				var connection = plumbConnectionManager.connections[id] || plumbConnectionManager.createConnection(id);
				$timeout(function() {
					scope.$watch(attrs['connecton'], function(newVal, oldVal) {
						connection.plumb.detachEveryConnection();	
						connection.connect(newVal);
						connection.plumb.repaintEverything();
					});
				});
			}
		}
	}]).

	directive('plumbRoot', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',
		    link: function(scope, element, attrs) {
		    	var root_container = attrs['rootContainer'],
		    		connection_id = attrs['plumbRoot'],
		    		connection = plumbConnectionManager.connections[connection_id] || plumbConnectionManager.createConnection(connection_id, root_container);
		    	
		    	connection.root = element.attr('id');
				
				$timeout(function() {
					scope.$watch(attrs['connecton'], function(newVal, oldVal) {
						connection.plumb.detachEveryConnection();	
						connection.connect(newVal);
						connection.plumb.repaintEverything();
					});
				});
		    }
		};
	}]).

	directive('plumbNode', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',

		    link: function(scope, element, attrs) {
		    	var node_container = attrs['nodeContainer'],
		    		connection_id = attrs['plumbNode'],
		    		connection = plumbConnectionManager.connections[connection_id] || plumbConnectionManager.createConnection(connection_id, node_container);
		    	connection.nodes.push(attrs['id']);
		    }
		};
	}]).

	directive('plumbSetContainer', ['plumbConnectionSetManager', function(plumbConnectionSetManager) {
		return {
			restrict: 'A',

			scope: {
				reinstantiateOn: '='
			},

			link: function(scope, element, attrs) {
				var id = attrs['id'];
				var connection_set = plumbConnectionSetManager.getSet(id);

				scope.$watch(scope.reinstantiateOn, function(newVal, oldVal) {
					connection_set.reinstantiatePlumb();
					connection_set.repaint();
				});
			}
		}
	}]).

	directive('plumbConnect', ['$timeout', 'plumbConnectionSetManager', function($timeout, plumbConnectionSetManager) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var container_id = attrs['containerId'];
				var	connection_id = attrs['connectionId'];
				var connector = ['Straight'];
				var anchors = [ [0.5, 0.5], [0.5, 0.5] ];
				var endpoint = ['Dot', {radius: 0.1}];

				var connection_set = plumbConnectionSetManager.getSet(container_id);

				if (attrs['connector'] === 'flowchart') {
					connector = [ "Flowchart", {
	                    stub:0,
	                    gap:0,
	                    cornerRadius:1,
	                    alwaysRespectStubs:true
	                } ];

	                anchors = [ [0.5,1,0,1], [0.5,0,0,-1] ];
				}

				connection_set.registerConnection(connection_id, {
					source: attrs['to'],
					target: attrs['id'],
					paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
					connector: connector,
					anchors: anchors,
					endpoint: endpoint
				});

				if (attrs['connecton']) {
					scope.$watch(attrs['connecton'], function(newVal, oldVal) {
						if (newVal === scope.$index) {
							if ( !(connection_set.active_connection(connection_id)) ) {
								console.log('creating');
								$timeout(function() {
									connection_set.connect(connection_id);
								}, parseInt(attrs['delay']));
							}
							else {
								console.log('repainting');
								$timeout(function() {
									connection_set.repaint(connection_id);
								}, parseInt(attrs['delay']));
							}
						}
						else {
							if ( connection_set.active_connection(connection_id) ) {
								console.log('detaching');
								connection_set.detach(connection_id);
							}
						}
					});
				}
				else {
					$timeout(function() {
						connection_set.connect(connection_id);
					}, attrs['delay']);
				}
			}	
		}
	}]);