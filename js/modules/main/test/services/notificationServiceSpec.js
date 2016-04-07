describe('notification', function() {

	var notification, lang;

	beforeEach(function() {
		module('main');
	});

	beforeEach(inject(function(_notification_, _langManager_) {
		notification = _notification_;
		langManager = _langManager_;
	}));

	it ('should store notification messages in both languages and return the one that is active', function() {
		notification.put(0)
		/* TODO: test that the message appears on the screen

		langManager.lang = 'en';
		expect(notification.get()).toEqual('all is fine');

		langManager.lang = 'he';
		expect(notification.get()).toEqual('הכל אחלה');
		*/
	});

});
