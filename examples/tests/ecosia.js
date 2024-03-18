describe('Ecosia.org Demo', function() {

  before(browser => {
    browser
      .navigateTo('https://www.ecosia.org/');
  });

  it('Demo test ecosia.org', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('Ecosia')
      .assert.visible('input[type=search]')
      .setValue('input[type=search]', 'nightwatch')
      .assert.visible('button[type=submit]')
      .click('button[type=submit]')
      .assert.textContains('.layout__content', 'Nightwatch.js');
  });

  // Alias tests


  it('should check Ecosia search and content', async function(browser) {
    // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for the content element to be visible (replace with correct selector)
    await browser.waitForElementVisible('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    // Find the element containing "Nightwatch.js" using `findElement`
    // (adjust selector based on your actual structure)
    const element = await browser.element('body').findElement({selector: '.layout__content'});

    if (element) {
      // Verify the content element contains "Nightwatch.js" text
      const contentText = await element;
      await browser.assert.containsText(contentText, 'Nightwatch.js');
    } else {
      console.error('Element not found');
    }
  });
  // passed till here!


  // Test for element.get()
  it('should check Ecosia search and content using element.get()', async function(browser) {
  // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for the content element to be visible (replace with correct selector)
    await browser.waitForElementVisible('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    // Find the element containing "Nightwatch.js" using `element.get()`
    const element = await browser.element('body').get('.layout__content');

    if (element) {
    // Verify the content element contains "Nightwatch.js" text
      await browser.assert.containsText(element, 'Nightwatch.js');
    } else {
      console.error('Element not found');
    }
  });

  // Test for element.findElement()
  it('should check Ecosia search and content using element.findElement()', async function(browser) {
  // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for the content element to be visible (replace with correct selector)
    await browser.waitForElementVisible('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    // Find the element containing "Nightwatch.js" using `element.findElement()`
    const element = await browser.element('body').findElement({selector: '.layout__content'});

    if (element) {
    // Verify the content element contains "Nightwatch.js" text
      await browser.assert.containsText(element, 'Nightwatch.js');
    } else {
      console.error('Element not found');
    }
  });

  // Test for element.findAll()
  it('should check Ecosia search and content using element.findAll()', async function(browser) {
  // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for all content elements to be visible (replace with correct selector)
    const elements = await browser.element('body').findAll('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    if (elements.length > 0) {
    // Verify each content element contains "Nightwatch.js" text
      for (const element of elements) {
        await browser.assert.containsText(element, 'Nightwatch.js');
      }
    } else {
      console.error('No elements found');
    }
  });

  // Test for element.getAll()
  it('should check Ecosia search and content using element.getAll()', async function(browser) {
  // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for all content elements to be visible (replace with correct selector)
    const elements = await browser.element('body').getAll('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    if (elements.length > 0) {
    // Verify each content element contains "Nightwatch.js" text
      for (const element of elements) {
        await browser.assert.containsText(element, 'Nightwatch.js');
      }
    } else {
      console.error('No elements found');
    }
  });

  // Test for element.findElements()
  it('should check Ecosia search and content using element.findElements()', async function(browser) {
  // Open the Ecosia website
    await browser.url('https://www.ecosia.org/');

    // Verify page title contains 'Ecosia'
    await browser.assert.titleContains('Ecosia');

    // Wait for the search input field to be visible
    await browser.waitForElementVisible('input[type=search]');

    // Set value in the search input field
    await browser.setValue('input[type=search]', 'nightwatch');

    // Click the submit button
    await browser.click('button[type=submit]');

    // Wait for all content elements to be visible (replace with correct selector)
    const elements = await browser.element('body').findElements('.layout__content'); // Assuming this points to the element containing "Nightwatch.js"

    if (elements.length > 0) {
    // Verify each content element contains "Nightwatch.js" text
      for (const element of elements) {
        await browser.assert.containsText(element, 'Nightwatch.js');
      }
    } else {
      console.error('No elements found');
    }
  });



  after(browser => browser.end());
});
