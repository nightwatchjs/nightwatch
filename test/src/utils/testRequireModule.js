const {strict: assert} = require('node:assert');
const path = require('node:path');

const common = require('../../common.js');
const requireModule = common.require('utils/requireModule.js');

describe('test requireModule', function () {
  it('should load commonjs file', function () {
    const modulePath = path.join(__dirname, './__data__/meaning-of-life.js');
    const meaningOfLife = requireModule(modulePath);

    assert.equal(meaningOfLife, 42);
  });

  it('should load es6 module', async function () {
    const modulePath = path.join(__dirname, './__data__/meaning-of-life.mjs');
    const meaningOfLife = await requireModule(modulePath);

    assert.equal(meaningOfLife, 42);
  });
});
