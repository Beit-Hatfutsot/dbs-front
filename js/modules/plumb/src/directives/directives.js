angular.module('plumb').

	directive('plumbContainer', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			    var id = element.attr('id');
				jsPlumb.setContainer(id);
				$timeout(function() {
					scope.$watch(attrs['connecton'], function(newVal, oldVal) {
						jsPlumb.detachEveryConnection();	
						plumbConnectionManager.connect(newVal);
					});
				});
			}
		}
	}]).

	directive('plumbRoot', ['plumbConnectionManager', function(plumbConnectionManager) {
		return {
			restrict: 'A',
		    link: function(scope, element) {
		    	plumbConnectionManager.root = element.attr('id');
		    }
		};
	}]).

	directive('plumbNode', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
		return {
			restrict: 'A',

		    link: function(scope, element, attrs) {
		    	//var connection;
		    	plumbConnectionManager.nodes.push(element);
		    	/*
		    	function connect() {
		    		console.log('connect ' + element.attr('id'))
	    			connection = jsPlumb.connect({
						source: plumbConnectionManager.root, 
						target: element.attr('id'),
						paintStyle:{ lineWidth: 1, strokeStyle: '#333333' },
						connector: 'Straight',
						anchor: 'Center'
					});
		    	}

		    	$timeout(function() {
		    		connect();
		    	});*/
		    }
		};
	}]).

    directive('onFinishConnect', ['$timeout', 'plumbConnectionManager', function($timeout, plumbConnectionManager) {
	    return {
	        restrict: 'A',
	        link: function (scope, element) {
	            if (scope.$last === true) {
	                $timeout(function () {
	                    //plumbConnectionManager.connect();
	                });
	            }
	        }
	    };
	}]);