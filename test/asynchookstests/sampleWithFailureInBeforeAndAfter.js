describe('sampleWithAssertionFailedInBefore', function() {
  before(function(c) {
    c.url('http://localhost');
    c.assert.equal(0, 1);
  });

  test('demo test async', c => {
    c.url('http://localhost');
  });

  after(function(c) {
    c.assert.strictEqual(0, 1);
  });
});
