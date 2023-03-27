describe('queries tests', function() {

  beforeEach(function(browser) {
    browser.navigateTo('http://localhost:13370');
  });

  it.skip('getFirstElementChild', async function({element}) {
    const firstChild = await element('#nested').getFirstElementChild();

    browser.execute(function(el) {
      console.log('firstChild', el);
    }, [firstChild]);

    const lastChild = await element('#nested').getLastElementChild();
    browser.execute(function(el) {
      console.log('lastChild', el);
    }, [lastChild]);

    const nextElementSibling = await element('#nested').getNextElementSibling();
    browser.execute(function(el) {
      console.log('nextElementSibling', el);
    }, [nextElementSibling]);

    const previousElementSibling = await element('#nested').getPreviusElementSibling();
    browser.execute(function(el) {
      console.log('previousElementSibling', el);
    }, [previousElementSibling]).debug();

    await expect(firstChild).to.be.an('h3');
  });

  it('findByRole', async function({element}) {
    const button = await element.findAll('section').nth(1).findByRole('button');
    await expect(button).to.be.an('button');

    await browser.click(button);
    await expect(button).text.to.equal('Button Clicked');
  });

  it('Button click works', async function(browser) {
    const button = await browser.element.findByText('Unique Button Text');

    await expect(button).text.not.to.equal('Button Clicked');

    await browser.click(button);

    await expect(button).text.to.equal('Button Clicked');
  });

  it('findByPlaceholderText', async function ({element, actions}) {

    const input = await element.findByPlaceholderText('Placeholder Text');

    await expect(input).property('value').not.to.equal('Hello Placeholder');

    // // Uses the User Actions API to type into the input
    await actions().sendKeys(input, 'Hello Placeholder').perform();

    await expect(input).property('value').to.equal('Hello Placeholder');
  });


  it('findByLabelText', async function ({element}) {
    const input = await element.findByLabelText('Label For Input Labelled By Id').sendKeys('Hello Input Labelled by Id');

    expect(input).value.toEqual('Hello Input Labelled by Id');
  });

  it('findByAltText', async function ({element}) {
    const image = await element.findByAltText('Image Alt Text').click();

    expect(image).css('border').toEqual('5px solid rgb(255, 0, 0)');
  });

  it('findAllByText', async function ({element}) {
    const philosophers = await element.findAllByText('of Miletus', {exact: false});
    expect(philosophers).to.have.length(2);
  });


});