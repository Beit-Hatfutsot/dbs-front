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

	directive('plumbRoot', ['plumbConnectionManager', function(plumbConnectionManager) {
		return {
			restrict: 'A',
		    link: function(scope, element, attrs) {
		    	var container_id = attrs['plumbRoot'];
		    	var connection = plumbConnectionManager.connections[container_id] || plumbConnectionManager.createConnection(container_id);
		    	connection.root = element.attr('id');
		    }
		};
	}]).

	directive('plumbNode', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',

		    link: function(scope, element, attrs) {
		    	var container_id = attrs['plumbNode'];
		    	var connection = plumbConnectionManager.connections[container_id] || plumbConnectionManager.createConnection(container_id);
		    	connection.nodes.push(element);
		    }
		};
	}]).


	directive('connectTo', ['plumbConnectionManager', function(plumbConnectionManager) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var container_id = attrs['containerId'];
				var connection = plumbConnectionManager.connections[container_id] || plumbConnectionManager.createConnection(container_id);
				connection.plumb.ready(function() {
					connection.plumb.connect({
						source: element.attr('id'),
						target: attrs['connectTo'],
						connector: ['Straight'],
						anchor: 'Center'
					});
				});
			}	
		}
	}]);