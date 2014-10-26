'use strict';

describe('lang-services', function() {

	beforeEach(function() {
		module('lang')
	});

	describe('langManager', function() {
		var langManager;

		beforeEach(inject(function(_langManager_) { 
			langManager = _langManager_;
		}));

		
		it('have a language property', function() {
			expect(langManager.hasOwnProperty('lang')).toBe(true);
		});
	});
});
