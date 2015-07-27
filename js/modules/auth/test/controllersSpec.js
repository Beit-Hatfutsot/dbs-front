'use strict';

ddescribe('auth-controllers', function() {

    beforeEach(function() {
        module('lang');
        module('auth');
    });

    describe('AuthCtrl', function() {

        var scope, modalInstance, $timeout, auth;

        beforeEach(inject(function($rootScope, $controller, $q, _$timeout_) {
            $timeout = _$timeout_;
            scope = $rootScope.$new();

            modalInstance = {                 
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                  then: jasmine.createSpy('modalInstance.result.then')
                }
            };

            auth = {};
            auth.signin = function(email, password) {
                var deferred = $q.defer();

                $timeout(function() {
                    if (email == 'test@email' && password == 'test-password') {
                        deferred.resolve();    
                    }
                    else {
                        deferred.reject();
                    }
                });

                return deferred.promise; 
            };

            $controller('AuthCtrl as authController', {
                $scope: scope, 
                $modalInstance: modalInstance,
                auth: auth,
                isRegister: false
            });
        }));

        it('should initiate a signin, close modal after success', function() {
            scope.authController.signin_data = {
                email: 'test@email',
                ps: 'test-password'
            };
            scope.authController.signin();
            $timeout.flush();
            expect(modalInstance.close).toHaveBeenCalled();
            expect(scope.authController.message).not.toEqual({en: '', he: ''});    
        });

        it('should initiate a signin, display error message on failure', function() {
            scope.authController.signin_data = {
                email: 'test@email',
                ps: 'wrong-password'
            };
            scope.authController.signin();
            $timeout.flush();
            expect(scope.authController.message).not.toEqual({en: '', he: ''});    
        });

        it('should close modal after dsimissal', function() {
            scope.authController.dismiss();
            expect(modalInstance.dismiss).toHaveBeenCalled();    
        });
    });
});
