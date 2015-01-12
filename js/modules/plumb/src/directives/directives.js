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


	directive('plumbConnect', ['$timeout', 'plumbConnectionManager2', function($timeout, plumbConnectionManager2) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var	connection_id = attrs['connectionId'];
				 
				plumbConnectionManager2.registerConnection(connection_id, {
					source: attrs['to'],
					target: attrs['id'],
					paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
					connector: ['Straight'],
					anchor: 'Center'
				});

				scope.$watch(attrs['connecton'], function(newVal, oldVal) {
					console.log(newVal)
					if (newVal === scope.$index) {
						if ( !(plumbConnectionManager2.active_connection(connection_id)) ) {
							console.log('creating');
							plumbConnectionManager2.connect(connection_id);
						}
					}
					else {
						if ( plumbConnectionManager2.active_connection(connection_id) ) {
							console.log('detaching');
							plumbConnectionManager2.detach(connection_id);
						}
					}
				});
			}	
		}
	}]);