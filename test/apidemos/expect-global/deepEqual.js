describe('expect() tests ', function () {
  it('deepEual', function() {
    const expectedMsg = {a: 1, b: 4};
    const receivedMsg = {b: 5};

    expect(expectedMsg).eql(receivedMsg);
  })
});
