'use strict';

describe('auth-controllers', function() {

    beforeEach(function() {
        module('lang');
        module('auth');
    });

    describe('AuthCtrl', function() {

        var scope, uibModalInstance, $timeout, auth, notification;

        beforeEach(inject(function($rootScope, $controller, $q, _$timeout_,
								  langManager) {
            $timeout = _$timeout_;
            scope = $rootScope.$new();

            uibModalInstance = {
                close: jasmine.createSpy('uibModalInstance.close'),
                dismiss: jasmine.createSpy('uibModalInstance.dismiss'),
                result: {
                  then: jasmine.createSpy('uibModalInstance.result.then')
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

            $controller('AuthCtrl as ctrl', {
                $scope: scope,
                $uibModalInstance: uibModalInstance,
				langManager: langManager,
                auth: auth,
				notification: notification,
                $state: {},
				config: {}
            });
        }));

        it('should initiate a signin, close modal after success', function() {
            scope.ctrl.signin_data = { email: 'test@example.com' };
            scope.ctrl.signin();
            $timeout.flush();
            expect(uibModalInstance.close).toHaveBeenCalled();
            expect(notification.put).toHaveBeenCalledWith(1);
        });

        it('should initiate a signin, display error message on failure', function() {
            scope.ctrl.signin_data = { email: 'error@example.com' };
            scope.ctrl.signin();
            $timeout.flush();
            expect(notification.put).toHaveBeenCalledWith(10);
        });

        it('should close modal after dsimissal', function() {
            scope.ctrl.dismiss();
            expect(uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
});
