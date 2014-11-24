'use strict';

describe('langManager', function() {
	var langManager;

	beforeEach(function() {
		module('lang')
	});

	beforeEach(inject(function(_langManager_) { 
		langManager = _langManager_;
	}));

	
	it('have a language property', function() {
		expect(langManager.hasOwnProperty('lang')).toBe(true);
	});
});
