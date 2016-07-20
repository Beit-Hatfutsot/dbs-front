'use strict';

describe('share-directives', function() {

	var $scope, $compile;

	beforeEach(function() {
		module('social');
		module('bhsclient-templates');
	});
	beforeEach(inject(function($injector) {
	    var $httpBackend = $injector.get('$httpBackend');
	    // $httpBackend.whenGET('templates/social/share.html').passThrough();
	}));
	beforeEach(inject(function (_$compile_, $rootScope) {
	    $compile = _$compile_;
	    $scope = $rootScope.$new();
	}));

	it('should create a safe_href',
	 function() {
		var template = $compile("<share href='link' link />")($scope);

		$scope.link="http://example.com";
		$scope.$digest();
		expect(template.isolateScope().safe_href).toMatch("http%3A%2F%2Fexample.com");
	});

	it('should generate facebook link',
	 function() {
		var template = $compile("<share href='\"http://example.com\"' facebook />")($scope);

		$scope.$digest();
		expect (template[0].outerHTML)
			.toMatch(/<a[^>]+https:\/\/www.facebook.com\/dialog\/share/);
	});

	it('should generate twitter link',
	 function() {
		var template = $compile("<share href='\"http://example.com\"' twitter />")($scope);

		$scope.$digest();
		expect (template[0].outerHTML)
			.toMatch(/<a[^>]+https:\/\/twitter.com\/intent\/tweet/);
	});
});

