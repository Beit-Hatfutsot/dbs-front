describe('MJS page', function() {
    var addButton = element(by.css('.mjs-widget-icon'));
    var itemHeader = element.all(by.css('.item-preview')).last().element(by.css('.header'));


    it('should add an item to mjs', function() {
        browser.get('http://bhsclient/item/familyNames/77498');
        addButton.click();
        element(by.css('.auth-modal')).isPresent();
        element(by.model('authController.signin_data.email')).sendKeys('tester@example.com');
        element(by.model('authController.signin_data.ps')).sendKeys('password');
        element(by.css('.auth-form__submit')).click();
        addButton.click();
        browser.get('http://bhsclient/mjs');
        expect(itemHeader.getText()).toMatch('ROTHSCHILD');
    });
});