angular.module('main').
	directive('draggable', [function() {
		return  {
			restrict: 'A',
			scope: {
				data: '='
			},
			link: function(scope, element, attrs) {
				if (attrs['draggable'] === 'true') {
					var el = element[0];
			        el.draggable = true;

			        el.addEventListener('dragstart', function(e) {
		                e.dataTransfer.effectAllowed = 'move';
		                e.dataTransfer.setData('data', JSON.stringify(scope.data));
		                scope.$emit('dragstart');
		                this.classList.add('drag');
		                return false;
		            }, false);

			        el.addEventListener('dragend', function(e) {
			            scope.$emit('dragend');
			            this.classList.remove('drag');
			            return false;
			        }, false);
			   	}
			}
		};
	}]);

angular.module('main').
	directive('droppable', function() {
	    return {
	    	scope: {
	    		ondrop: '&',
	    		branchName: '=',
	    		context: '&'
	    	},
	        link: function(scope, element, attrs) {
	            var el = element[0];

	            el.addEventListener('dragover', function(e) {
				    e.dataTransfer.dropEffect = 'move';
				    // allows us to drop
				    if (e.preventDefault) e.preventDefault();
				    this.classList.add('over');
				    return false;
				}, false);

				el.addEventListener('dragenter', function(e) {
				    this.classList.add('over');
				    return false;
				}, false);

				el.addEventListener('dragleave', function(e) {
					this.classList.remove('over');
				    return false;
				}, false);

				el.addEventListener('drop', function(e) {
			        // Stops some browsers from redirecting.
			        if (e.stopPropagation) e.stopPropagation();

			        this.classList.remove('over');

			        var item = JSON.parse(e.dataTransfer.getData('data'));
			        scope.$apply(function(scope) {
					    var fn = scope.ondrop();
					    if ('undefined' !== typeof fn) {
					    	if (scope.context) {
					    		fn.apply(scope.context(), [scope.branchName, item]);
					    	}
					    	else {
					    		fn(scope.branchName, item);
					    	}
					    }
					});

			        return false;
				}, false);
	        }
	    }
	});