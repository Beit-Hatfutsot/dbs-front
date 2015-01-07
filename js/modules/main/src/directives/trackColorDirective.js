angular.module('main').
	directive('trackColor', [function() {
		return {
			link: function(scope, element, attrs) {
				element.change(function () {
					console.log(element)
				    var val = (element.val() - element.attr('min')) / (element.attr('max') - element.attr('min'));

				    element.css('background-image',
		                '-webkit-gradient(linear, left top, right top, '
		                + 'color-stop(' + val + ', '+ attrs['start'] + '), '
		                + 'color-stop(' + val + ', ' + attrs['stop'] + ')'
		                + ')'
	                );
	                /*element.css('background-image',
		                '-moz-gradient(linear, left top, right top, '
		                + 'color-stop(' + val + ', '+ attrs['start'] + '), '
		                + 'color-stop(' + val + ', ' + attrs['stop'] + ')'
		                + ')'
	                );*/
	                element.css('background-image',
		                'linear-gradient(to right, ' + attrs['start'] + ' ' + val + ' ' + attrs['stop'] + ' ' + val +')'
	                );
				});
			}
		};
	}]);