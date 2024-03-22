describe('sample test with describe', function() {
  this.unitTest = true;

  test('demoSync', () => {
    this.client.globals.calls++;
  });

  test('demoTestAsync', (done) => {
    this.client.globals.calls++;
    setTimeout(function () {
      done();
    }, 10);
  });
});
