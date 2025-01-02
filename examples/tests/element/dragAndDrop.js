describe('Element Drag & Drop Demo', function () {
  before(browser => {
    browser.navigateTo(
      'https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransfer.html'
    );
  });

  it('move element demo', async function (browser) {
    const srcMoveElem = browser.element('#src_move'); // returns a Nightwatch Element Wrapper with loads of element commands.

    // pause to see the initial state
    browser.pause(1000);

    // drag src element 80 pixels below.
    srcMoveElem.dragAndDrop({x: 0, y: 80});
  });

  it('copy element demo', async function (browser) {
    const srcCopyElem = browser.element('#src_copy'); // returns a Nightwatch Element Wrapper with loads of element commands.
    const destCopyWebElem = await browser.element('#dest_copy'); // awaiting the browser.element command returns a WebElement object (actual result).

    // pause to see the initial state
    browser.pause(1000);

    // drag src element to dest element.
    srcCopyElem.dragAndDrop(destCopyWebElem);
  });

  after((browser) => {
    // pause to see the final state
    browser.pause(2000);

    browser.end();
  });
});
