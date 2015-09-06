'use strict';

var VerifyEmailController = function($stateParams, tokenVerifier) {
	var verification_token = $stateParams.verification_token;
	tokenVerifier.verify(verification_token).
		success(function(data) {console.log(data)}).
		error(function() {console.log('All is lost! :(((')});
};

angular.module('main').controller('VerifyEmailController', ['$stateParams', 'tokenVerifier', VerifyEmailController]);