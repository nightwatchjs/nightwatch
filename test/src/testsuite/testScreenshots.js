const assert = require('assert');
const common = require('../../common.js');
const Screenshots = common.require('testsuite/screenshots.js');

describe('test Screenshots', function() {

  it('getScreenshotFileName', function() {

    let filename = Screenshots.getScreenshotFileName('', true, '');

    assert.equal(filename.indexOf(':'), -1);
    assert.equal(filename.indexOf('('), -1);
    assert.equal(filename.indexOf(')'), -1);
    assert.equal(filename.indexOf('+'), -1);
    assert.equal(filename.indexOf(' '), -1);
  });
});
