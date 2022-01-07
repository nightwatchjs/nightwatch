describe('sampleWithFailureInTestcaseAndAfter', function() {
  before(function(c) {
    c.url('http://localhost');
  });

  test('demo test async', c => {
    c.url('http://localhost');
    c.assert.equal(0, 1);
  });

  after(function(c) {
    c.assert.strictEqual(0, 1);
  });

});
