describe('Element Drag & Drop Demo', function () {
  before((browser) => {
    browser.navigateTo(
      'https://mdn.github.io/dom-examples/drag-and-drop/copy-move-DataTransfer.html'
    );
  });

  it('Demo', async function (browser) {
    const div1 = browser.element('#src_move');
    browser.pause(3000);
    div1.dragAndDrop({x: 0, y: -40}); // drag element 40 pixels below.
    browser.pause(3000);
  });

  after((browser) => browser.end());
});
