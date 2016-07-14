'use strict';

describe('share-directives', function() {

	var $scope, $compile;

	module('social');
	module('bhsclient-templates');
	beforeEach(inject(function (_$compile_, $rootScope) {
	    $compile = _$compile_;
	    $scope = $rootScope.$new();
	}));

	it('should use the href provided',
	 function() {
		var template = $compile("<share href='http://example.com' link />")($scope);

		$scope.$digest()
		expect (template[0].outerHTML)
			.toMatch(/<a[^>]+http:\/\/example\.com/);
	});

	it('should generate facebook link',
	 function() {
		var template = $compile("<share href='http://example.com' facebook />")($scope);

		$scope.$digest()
		expect (template[0].outerHTML)
			.toMatch(/<a[^>]+https:\/\/www.facebook.com\/dialog\/share/);
	});

	it('should generate twitter link',
	 function() {
		var template = $compile("<share href='http://example.com' twitter />")($scope);

		$scope.$digest()
		expect (template[0].outerHTML)
			.toMatch(/<a[^>]+https:\/\/twitter.com\/intent\/tweet/);
	});
});

