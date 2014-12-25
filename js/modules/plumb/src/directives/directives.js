angular.module('plumb').

	directive('plumbContainer', [function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			    var id = element.attr('id');
				
				jsPlumb.setContainer(id);
			}
		}
	}]).

	directive('plumbRoot', ['plumbConnectionManager', function(plumbConnectionManager) {
		return {
			restrict: 'A',
		    link: function(scope, element) {
		    	console.log(element.attr('id'))
		    	plumbConnectionManager.root = element.attr('id');
		    }
		};
	}]).

	directive('plumbNode', ['plumbConnectionManager', function(plumbConnectionManager) {
		return {
			restrict: 'A',
		    link: function(scope, element) {
		    	plumbConnectionManager.nodes.push(element);
		    	scope.$on('$destroy', function() {
		    		jsPlumb.detachEveryConnection();
		    	});
		    }
		};
	}]).

    directive('onFinishConnect', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
	    return {
	        restrict: 'A',
	        link: function (scope, element) {
	            if (scope.$last === true) {
	                $timeout(function () {
	                    plumbConnectionManager.connect();
	                });
	            }
	        }
	    };
	}]);