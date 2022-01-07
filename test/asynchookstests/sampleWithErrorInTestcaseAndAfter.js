describe('sampleWithFailureInTestcaseAndAfter', function() {
  before(function(c) {
    c.url('http://localhost');
  });

  test('demo test async', c => {
    c.url('http://localhost');

    throw new Error('error in testcase');
  });

  after(function(c) {
    c.assert.strictEqual(0, 1);
  });

});
