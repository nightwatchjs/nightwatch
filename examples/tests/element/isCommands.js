describe('Element "is" commands Demo', function () {
  before((browser) => {
    browser.navigateTo('https://www.ecosia.org/settings');
  });

  it('Demo', async function (browser) {
    // accepting cookies to remove modal
    browser.element('.cookie-consent__actions').getLastElementChild().click();

    const saveButton = browser.element('.settings-form__buttons > .base-button--variant-solid-green');
    const cancelButton = browser.element('.settings-form__buttons > .base-button--variant-outline');

    saveButton.isVisible().assert.equals(true);
    cancelButton.isVisible().assert.equals(true);

    saveButton.isEnabled().assert.equals(false);
    cancelButton.isEnabled().assert.equals(true);

    const newTabCheckbox = browser.element('#e-field-newTab');

    newTabCheckbox.isSelected().assert.equals(false);

    // Clicking the checkbox selects it.
    // Also our save button becomes enabled.
    newTabCheckbox.click();

    newTabCheckbox.isSelected().assert.equals(true);
    saveButton.isEnabled().assert.equals(true);

    // click the cancel button
    cancelButton.click();
  });

  after((browser) => browser.end());
});
