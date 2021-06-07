var assert = require('assert');
module.exports = {
  desiredCapabilities: {
    name: 'test-srcFolders'
  },
  srcFoldersTest: function (client) {
    assert.strictEqual(client.options.desiredCapabilities.name, 'test-srcFolders');
  }
};
