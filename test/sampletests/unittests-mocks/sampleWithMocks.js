const assert = require('assert');
describe('unit tests with sinon methods', function() {
  this.unitTest = true;
  it('test object with stub method', function(){
    const obj = {
      foo: function() {
        return 'foo';
      }
    };
    browser.stub(obj, 'foo').returns('bar');
    assert.strictEqual(obj.foo(), 'bar');
  });

  it('test object method is called once', function(){
    const obj = {
      foo: function() {
        return 'foo';
      }
    };
    const spy = browser.spy(obj, 'foo');
    assert.strictEqual(obj.foo(), 'foo');
    assert.ok(spy.calledOnce);
  });
});