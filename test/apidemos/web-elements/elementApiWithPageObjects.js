const assert = require('assert');
const {WebElement} = require('selenium-webdriver');

describe('demo tests with new element api in page objects', function () {
  after(browser => browser.end());

  const pageObject = this.page.simplePageObj();

  it('element api on page objects', async function() {
    const elementResult = await pageObject.element('@loginAsString');
    assert.strictEqual(elementResult instanceof WebElement, true);
    assert.strictEqual(await elementResult.getId(), '5cc459b8-36a8-3042-8b4a-258883ea642b');

    const elementFindResult = await pageObject.element.find('@loginIndexed');
    assert.strictEqual(elementFindResult instanceof WebElement, true);
    assert.strictEqual(await elementFindResult.getId(), '3783b042-7001-0740-a2c0-afdaac732e9f');

    const elementFindAllResult = await pageObject.element.findAll('@loginXpath');
    assert.strictEqual(elementFindAllResult.length, 2);
    assert.strictEqual(elementFindAllResult[0] instanceof WebElement, true);
    assert.strictEqual(await elementFindAllResult[1].getId(), '3783b042-7001-0740-a2c0-afdaac732e9f');

    const findByTextResult = await pageObject.element.findByText('Web Login');
    assert.strictEqual(findByTextResult instanceof WebElement, true);
    assert.strictEqual(await findByTextResult.getId(), '5cc459b8-36a8-3042-8b4a-258883ea642b');
  });

  it('element api on sections', async function() {
    const signupSection = pageObject.section.signUp;

    const elementResult = await signupSection.element('@help');
    assert.strictEqual(elementResult instanceof WebElement, true);
    assert.strictEqual(await elementResult.getId(), '1');

    const elementFindResult = await signupSection.element.find('@help');
    assert.strictEqual(elementFindResult instanceof WebElement, true);
    assert.strictEqual(await elementFindResult.getId(), '1');

    const findByTextResult = await signupSection.element.findByText('Help');
    assert.strictEqual(findByTextResult instanceof WebElement, true);
    assert.strictEqual(await findByTextResult.getId(), '2');

    const getStartedSection = signupSection.section.getStarted;

    const elementFindResult2 = await getStartedSection.element.find('#getStartedStart');
    assert.strictEqual(elementFindResult2 instanceof WebElement, true);
    assert.strictEqual(await elementFindResult2.getId(), '4');

    const elementFindAllResult = await getStartedSection.element.findAll('@start');
    assert.strictEqual(elementFindAllResult.length, 3);
    assert.strictEqual(elementFindAllResult[0] instanceof WebElement, true);
    assert.strictEqual(await elementFindAllResult[2].getId(), '6');
  });
});
