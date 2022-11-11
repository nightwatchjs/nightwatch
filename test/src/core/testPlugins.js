const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
describe('test nightwatch plugins', function() {
  
  it('nightwatch-axe plugin should be loaded by default', async function() {
    const client = Nightwatch.createClient({});
    await client.initialize();

    assert.ok('axeInject' in client.api);
    assert.ok('axeRun' in client.api);
    assert.strictEqual(typeof client.api.axeInject, 'function');
    assert.strictEqual(typeof client.api.axeInject, 'function');
  });
});
