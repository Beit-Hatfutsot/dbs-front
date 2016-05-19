'use strict';

describe('auth-controllers', function() {

    beforeEach(function() {
        module('lang');
        module('auth');
    });

    describe('AuthCtrl', function() {

        var scope, modalInstance, $timeout, auth, notification;

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

            notification = {
                put: jasmine.createSpy('notification.put'),
                loading: jasmine.createSpy('notification.loading')
            };

            auth = {};
            auth.signin = function(email) {
                var deferred = $q.defer();

                $timeout(function() {
                    if (email == 'test@example.com') {
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
				notification: notification,
                isRegister: false
            });
        }));

        it('should initiate a signin, close modal after success', function() {
            scope.authController.signin_data = { email: 'test@example.com' };
            scope.authController.signin();
            $timeout.flush();
            expect(modalInstance.close).toHaveBeenCalled();
            expect(notification.put).toHaveBeenCalledWith(1);
        });

        it('should initiate a signin, display error message on failure', function() {
            scope.authController.signin_data = { email: 'error@eaxample.com' };
            scope.authController.signin();
            $timeout.flush();
            expect(notification.put).toHaveBeenCalledWith(10);
        });

        it('should close modal after dsimissal', function() {
            scope.authController.dismiss();
            expect(modalInstance.dismiss).toHaveBeenCalled();    
        });
    });
});
