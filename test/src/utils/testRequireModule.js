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

  it('should load named exports from .mjs file', async function () {
    const modulePath = path.join(__dirname, './__data__/named-exports.mjs');
    const module = await requireModule(modulePath);

    assert.equal(typeof module.functionA, 'function');
    assert.equal(typeof module.functionB, 'function');
  });

  it('should load default and named exports from .mjs file', async function () {
    const modulePath = path.join(__dirname, '__data__/mixed-exports.mjs');
    const module = await requireModule(modulePath);

    assert.equal(module. defaultValue, 'default-value');
    assert.equal(module.defaultFunction(), 'default function called');
    assert.equal(module.namedExport, 'named value');
    assert.equal(module.namedFunction(), 'named function called');
  });


});