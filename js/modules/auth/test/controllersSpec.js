'use strict';

describe('auth-controllers', function() {

    beforeEach(function() {
        module('lang');
        module('apiClient');
        module('auth');
    });

    describe('AuthCtrl', function() {

        var scope, modalInstance, $timeout, authManager;

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

            authManager = {};
            authManager.signin = function() {
                var deferred = $q.defer();

                $timeout(function() {
                    deferred.resolve();
                });

                return deferred.promise; 
            };

            $controller('AuthCtrl as authController', {
                $scope: scope, 
                $modalInstance: modalInstance,
                authManager: authManager
            });
        }));

        it('should initiate a signin, close modal after success', function() {
            scope.authController.signin();
            $timeout.flush();
            expect(modalInstance.close).toHaveBeenCalled();
            expect(scope.authController.message).not.toEqual('');    
        });

        it('should close modal after dsimissal', function() {
            scope.authController.dismiss();
            expect(modalInstance.dismiss).toHaveBeenCalled();    
        });
    });
});
