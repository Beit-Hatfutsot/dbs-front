describe('bhpClient-controllers', function() {

	beforeEach(function() {
		module('bhpClient');
	});

	describe('MainCtrl', function() {

		var scope;

		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			scope = $rootScope.$new(); 
			$controller('MainCtrl as mainController', {$scope: scope});
		}));

		it('should set and get a language', function() {

			expect(scope.mainController.hasOwnProperty('lang')).toBe(true);
			expect(scope.mainController.lang).toBe('he');

			scope.mainController.lang = 'en';
			expect(scope.mainController.lang).toBe('en');
		});
	});
});
