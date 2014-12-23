angular.module('main').
	directive('draggable', function() {
		return  {
			restrict: 'A',
			scope: {
				ondragstart: '&',
				ondragend: '&',
				data: '='
			},
			link: function(scope, element) {
				var el = element[0];
				console.log(scope)
		        el.draggable = true;

		        el.addEventListener('dragstart', function(e) {
	                e.dataTransfer.effectAllowed = 'move';
	                e.dataTransfer.setData('data', JSON.stringify(scope.data));
	                scope.$apply(function(scope) {
					    var fn = scope.ondragstart();
					    if ('undefined' !== typeof fn) {
					      fn();
					    }
					});
	                this.classList.add('drag');
	                return false;
	            }, false);

		        el.addEventListener('dragend', function(e) {
		            scope.$apply(function(scope) {
					    var fn = scope.ondragend();
					    if ('undefined' !== typeof fn) {
					      fn();
					    }
					});
		            this.classList.remove('drag');
		            return false;
		        }, false);
			}
		};
	});

angular.module('main').
	directive('droppable', function() {
	    return {
	    	scope: {
	    		ctrl: '=',
	    		ondrop: '&',
	    		branchName: '='
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
					      fn(scope.branchName, item);
					    }
					});

			        return false;
				}, false);
	        }
	    }
	});